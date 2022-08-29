import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Article, ArticleDocument, CreateArticleDto, FavoriteArticle, FavoriteArticleDocument } from './models/article.model';

@Injectable()
export class ArticlesService {


    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
        @InjectModel(FavoriteArticle.name) private favoriteArticleModel: Model<FavoriteArticleDocument>,
        private profileService: ProfilesService
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

    async getArticle(slug: string, requesterId?: string): Promise<Article> {
        const article = await this.articleModel.findOne({ slug }, '-_id -__v');

        const [isFavorite, profile] = await Promise.all([
            this.favoriteArticleModel.findOne({ articleId: article._id, userId: requesterId }),
            this.profileService.findProfileById(article.author, requesterId)
        ])


        return {
            author : profile,
            body : article.body,
            createdAt : article.createdAt,
            updatedAt : article.updatedAt,
            description : article.description,
            favoriteCount : article.favoriteCount,
            favorited : isFavorite !== null,
            slug : article.slug,
            tagList : article.tagList,
            title : article.title,
        };
    }

    private getTitleSlug(title: string) {
        return title.toLocaleLowerCase().replace(/ /g, '-');
    }

}
