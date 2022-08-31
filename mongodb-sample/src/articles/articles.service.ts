import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { Article, ArticleDocument, ArticleQueryOptions, CreateArticleDto, UpdateArticleDto } from './models/article.model';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        private userService: UsersService,
    ) {
    }

    async createArticle(authorId: string, data: CreateArticleDto): Promise<Article> {

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

        return await new this.articleModel(articleData).save();
    }

    async listArticles(queryOptions: ArticleQueryOptions, requesterId: string) {

        let query: any = {};

        const [
            author,
            requester,
        ] = await Promise.all([
            queryOptions.query.author ? this.userService.findByUsername(queryOptions.query.author) : null,
            this.userService.findById(requesterId),
        ]);

        if (author) {
            query.author = (author as UserDocument)._id;
        }

        if (queryOptions.query.tag != null) {
            query.tagList = queryOptions.query.tag
        }

        const [
            articleCount,
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
            articleCount,
            articles: articles.map(article => {
                return article.toJson(requester)
            })
        }

        return res;
    }

    async getArticlesFeed(queryOptions: ArticleQueryOptions, requesterId: string) {
        // get articles created by followed users
        const user = await this.userService.findById(requesterId);

        const followed = user.following;

        const [articleCount, articles] = await Promise.all([
            this.articleModel.count({ author: { $in: followed } }).exec(),
            this.articleModel.find({ author: { $in: followed } })
                .sort({ createdAt: 'desc' })
                .skip(queryOptions.offset)
                .limit(queryOptions.limit)
                .populate('author')
        ]);

        const res = {
            articleCount,
            articles: articles.map(article => {
                return article.toJson(user)
            })
        }

        return res;
    }

    async getArticle(slug: string, requesterId?: string) {
        const user = await this.userService.findById(requesterId);
        const article = await this.articleModel.findOne({ slug }, '-_id -__v')
            .populate('author');

        return article.toJson((user as UserDocument));
    }

    async updateArticle(slug: string, data: UpdateArticleDto, requesterId: string) {
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

        return {
            article : updatedArticle.toJson(user)
        }
    }

    async deleteArticle(slug : string, requesterId) {
        const article = await this.articleModel.findOne({ slug })
        const user = await this.userService.findById(requesterId);

        
        if ((article.author as any).toString() !== ((user as UserDocument)._id).toString()) {
            throw new ForbiddenException('User does not have access to article');
        }

        return await article.delete();
    }

    private getTitleSlug(title: string) {
        return title.toLocaleLowerCase().replace(/ /g, '-');
    }


}
