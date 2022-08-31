import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfilesService } from 'src/profiles/profiles.service';
import { UserDocument } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { Article, ArticleDocument, ArticleQueryOptions, ArticleQueryParams, CreateArticleDto } from './models/article.model';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
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
            author,
            requester,
        ] = await Promise.all([
            queryOptions.query.author ? this.userService.findByUsername(queryOptions.query.author) : null,
            this.userService.findById(requesterId),
        ]);

        if (author) {
            query.author = (author as UserDocument)._id;
        }

        // if (favoritedUserId) {
        //     const articleIds = (await this.favoriteArticleModel.find({ userId: favoritedUserId }))
        //         .map((fav) => fav.articleId);
        //     query._id = { $in: articleIds }
        // }

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

    async getArticle(slug: string, requesterId?: string) {
        const user = await this.userService.findById(requesterId);
        const article = await this.articleModel.findOne({ slug }, '-_id -__v')
            .populate('author');


        return article.toJson((user as UserDocument));
    }

    private getTitleSlug(title: string) {
        return title.toLocaleLowerCase().replace(/ /g, '-');
    }


}
