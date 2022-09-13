import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryOptions } from './interfaces/article-query-options.interface';
import { ArticleJSON, MultipleArticleRO } from './interfaces/article.interface';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        private userService: UsersService,
    ) { }

    async createArticle(authorId: string, data: CreateArticleDto): Promise<ArticleJSON> {
        const user = await this.userService.findById(authorId);

        const now = new Date().toISOString();
        const slug = this.getTitleSlug(data.title)

        const articleData = {
            ...data,
            slug,
            author: authorId,
            createdAt: now,
            updatedAt: now,
            favoritesCount: 0,
        }

        const article = await new this.articleModel(articleData).save()

        return (await article.populate('author')).toJSON(user);
    }

    async listArticles(queryOptions: ArticleQueryOptions, requesterId?: string): Promise<MultipleArticleRO> {

        let query: any = {};

        try {
            const [
                author,
                requester,
            ] = await Promise.all([
                queryOptions.query.author ? this.userService.findByUsername(queryOptions.query.author) : null,
                requesterId ? this.userService.findById(requesterId) : null,
            ]);

            if (author) {
                query.author = (author as UserDocument)._id;
            }

            if (queryOptions.query.tag != null) {
                query.tagList = queryOptions.query.tag
            }

            const [
                articlesCount,
                articles
            ] = await Promise.all([
                this.articleModel.count(query).exec(),
                this.articleModel.find(query)
                    .sort({ createdAt: 'desc' })
                    .skip(queryOptions.offset)
                    .limit(queryOptions.limit)
                    .populate('author')
            ])

            const res = {
                articlesCount,
                articles: articles.map(article => {
                    return article.toJSON(requester)
                })
            }

            return res;
        } catch (error) {
            if (error.response.statusCode === 404 && error.response.message === "User not found") {
                return {
                    articles: [],
                    articlesCount: 0
                }
            }
        }
    }

    async getArticlesFeed(queryOptions: ArticleQueryOptions, requesterId: string): Promise<MultipleArticleRO> {
        // get articles created by followed users
        const user = await this.userService.findById(requesterId);

        const followed = user.following;

        const [articlesCount, articles] = await Promise.all([
            this.articleModel.count({ author: { $in: followed } }).exec(),
            this.articleModel.find({ author: { $in: followed } })
                .sort({ createdAt: 'desc' })
                .skip(queryOptions.offset)
                .limit(queryOptions.limit)
                .populate('author')
        ]);

        const res = {
            articlesCount,
            articles: articles.map(article => {
                return article.toJSON(user)
            })
        }

        return res;
    }

    async findArticle(slug: string) {
        return await this.articleModel.findOne({ slug })
    }

    async getArticle(slug: string, requesterId?: string): Promise<ArticleJSON> {
        const user = requesterId ? await this.userService.findById(requesterId) : null;
        const article = await this.findArticle(slug)
        const populatedArticle = await article.populate('author');

        return populatedArticle.toJSON((user as UserDocument));
    }

    async updateArticle(slug: string, data: UpdateArticleDto, requesterId: string): Promise<ArticleJSON> {
        const article = await this.articleModel.findOne({ slug })
        const user = await this.userService.findById(requesterId);

        if ((article.author as any).toString() !== ((user as UserDocument)._id).toString()) {
            throw new ForbiddenException('User does not have access to article');
        }

        for (const key in data) {
            if (key === 'title') {
                article.title = data.title;
                article.slug = this.getTitleSlug(data.title)
            } else {
                article[key] = data[key];
            }
        }

        const updatedArticle = await (await article.save()).populate('author');

        return updatedArticle.toJSON(user)
    }

    async deleteArticle(slug: string, requesterId: string) {
        const article = await this.articleModel.findOne({ slug })
        const user = await this.userService.findById(requesterId);


        if ((article.author as any).toString() !== ((user as UserDocument)._id).toString()) {
            throw new ForbiddenException('User does not have access to article');
        }

        return await article.delete();
    }

    async favoriteArticle(slug: string, requesterId: string): Promise<ArticleJSON> {
        const [user, article] = await Promise.all([
            this.userService.findById(requesterId),
            this.articleModel.findOne({ slug }).populate('author')
        ]);

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        if (user.favorites.includes((article as ArticleDocument)._id)) {
            throw new BadRequestException('Article already favorited');
        }

        article.favoritesCount++;

        const [updatedUser, updatedArticle] = await Promise.all([
            this.userService.addFavoriteArticle(requesterId, (article as ArticleDocument)._id),
            (await article.save()).populate('author')
        ]);

        return updatedArticle.toJSON(updatedUser)
    }

    async unfavoriteArticle(slug: string, requesterId: string): Promise<ArticleJSON> {
        const [user, article] = await Promise.all([
            this.userService.findById(requesterId),
            this.articleModel.findOne({ slug }).populate('author')
        ]);

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        if (!user.favorites.includes((article as ArticleDocument)._id)) {
            throw new BadRequestException('Article is not favorited by user');
        }

        article.favoritesCount--;

        const [updatedUser, updatedArticle] = await Promise.all([
            this.userService.removeFavoriteArticle(requesterId, (article as ArticleDocument)._id),
            (await article.save()).populate('author')
        ]);

        return updatedArticle.toJSON(updatedUser);
    }

    private getTitleSlug(title: string): string {
        return title.toLocaleLowerCase().replace(/ /g, '-');
    }


}
