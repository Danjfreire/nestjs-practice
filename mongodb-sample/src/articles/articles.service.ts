import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { UsersService } from 'src/users/users.service';
import { Article, ArticleData, CreateArticleDto } from './models/article.model';

@Injectable()
export class ArticlesService {

    private articleCollection: Collection<ArticleData>

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
        private userService: UsersService
    ) {
        this.articleCollection = this.db.collection('articles');
    }

    async createArticle(authorUsername: string, data: CreateArticleDto) {

        const user = await this.userService.findByUsername(authorUsername);

        const now = new Date().toISOString();
        const slug = this.getTitleSlug(data.title)

        const articleData: ArticleData = {
            ...data,
            slug,
            author: authorUsername,
            createdAt: now,
            updatedAt: now,
            favoritesCount: 0,
        }

        await this.articleCollection.insertOne(articleData);

        const article: Article = {
            ...data,
            slug,
            createdAt: now,
            updatedAt: now,
            favoritesCount: 0,
            favorited: false,
            author: {
                bio: user.bio ?? '',
                following: false,
                image: user.image ?? '',
                username: user.username
            }
        }

        return article;
    }

    async getArticle(slug: string) : Promise<Article> {
        const article = await this.articleCollection.aggregate()
            .match({ slug })
            .lookup({
                from: 'users',
                localField: 'author',
                foreignField: 'username',
                as: 'author',
                pipeline: [
                    {
                        $project: {_id: 0, password : 0 }
                    }
                ]
            })
            .unwind("$author")
            .project({ _id: 0 })
            .next();

        return article as Article;
    }

    private getTitleSlug(title: string) {
        return title.toLocaleLowerCase().replace(/ /g, '-');
    }

}
