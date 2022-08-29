import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfilesService } from 'src/profiles/profiles.service';
import { UserDocument } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { Article, ArticleDocument, ArticleQueryOptions, ArticleQueryParams, CreateArticleDto, FavoriteArticle, FavoriteArticleDocument } from './models/article.model';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        @InjectModel(FavoriteArticle.name) private favoriteArticleModel: Model<FavoriteArticleDocument>,
        private profileService: ProfilesService,
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
            authorId,
            favoritedUserId,
            requester,
            followersIds,
            favoritedArticles
        ] = await Promise.all([
            queryOptions.query.author ? this.userService.findByUsername(queryOptions.query.author) : null,
            queryOptions.query.favorited ? this.userService.findByUsername(queryOptions.query.favorited) : null,
            this.userService.findById(requesterId),
            this.profileService.getFollowersById(requesterId),
            this.favoriteArticleModel.find({ userId: requesterId })
        ]);

        if (authorId) {
            query.author = authorId;
        }

        if (favoritedUserId) {
            const articleIds = (await this.favoriteArticleModel.find({ userId: favoritedUserId }))
                .map((fav) => fav.articleId);
            query._id = { $in: articleIds }
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
        ])

        const res = {
            articleCount,
            articles: articles.map(article => {

                const author = {
                    username: requester.username,
                    bio: requester.bio,
                    image: requester.image,
                    following: followersIds.includes(article.author)
                }

                return {
                    author,
                    body: article.body,
                    createdAt: article.createdAt,
                    updatedAt: article.updatedAt,
                    description: article.description,
                    favoriteCount: article.favoriteCount,
                    favorited: favoritedArticles.includes((article as ArticleDocument)._id),
                    slug: article.slug,
                    tagList: article.tagList,
                    title: article.title,
                }

            })
        }

        return res;
    }

    async getArticle(slug: string, requesterId?: string): Promise<Article> {
        const article = await this.articleModel.findOne({ slug }, '-_id -__v');

        const [isFavorite, profile] = await Promise.all([
            this.favoriteArticleModel.findOne({ articleId: article._id, userId: requesterId }),
            this.profileService.findProfileById(article.author, requesterId)
        ])


        return {
            author: profile,
            body: article.body,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            description: article.description,
            favoriteCount: article.favoriteCount,
            favorited: isFavorite !== null,
            slug: article.slug,
            tagList: article.tagList,
            title: article.title,
        };
    }

    private getTitleSlug(title: string) {
        return title.toLocaleLowerCase().replace(/ /g, '-');
    }


}
