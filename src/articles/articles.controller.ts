import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { RequestUser, User } from 'src/@shared/decorators/user.decorator';
import { AnonymousAuthGuard } from 'src/auth/guards/anonymous-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryOptions } from './interfaces/article-query-options.interface';
import { ArticleRO, MultipleArticleRO } from './interfaces/article.interface';

@Controller('articles')
export class ArticlesController {

    constructor(
        private articleService: ArticlesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArticle(
        @User() user : RequestUser,
        @Body('article') articleDto: CreateArticleDto
    ): Promise<ArticleRO> {
        const userId = user.id;

        const res = await this.articleService.createArticle(userId, articleDto);

        return {
            article: res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('feed')
    async getFeed(
        @Query('limit') limit = 20,
        @Query('offset') offset = 0,
        @User() user : RequestUser,
    ): Promise<MultipleArticleRO> {
        const articleQueryOptions: ArticleQueryOptions = {
            limit,
            offset
        }

        return await this.articleService.getArticlesFeed(articleQueryOptions, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':slug')
    async getArticle(
        @User() user : RequestUser,
        @Param('slug') slug: string,
    ): Promise<ArticleRO> {
        const res = await this.articleService.getArticle(slug, user.id);

        return {
            article: res
        }
    }

    @UseGuards(AnonymousAuthGuard)
    @Get('')
    async listArticles(
        @Query('tag') tag: string,
        @Query('author') author: string,
        @Query('favorited') favorited: string,
        @Query('limit') limit = 20,
        @Query('offset') offset = 0,
        @User() user : RequestUser,
    ): Promise<MultipleArticleRO> {

        const articleQueryOptions: ArticleQueryOptions = {
            query: { tag, author, favorited },
            limit,
            offset
        }

        return await this.articleService.listArticles(articleQueryOptions, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':slug')
    async updateArticle(
        @Param('slug') slug: string,
        @Body('article') articleDto: UpdateArticleDto,
        @User() user : RequestUser,
    ): Promise<ArticleRO> {
        const res = await this.articleService.updateArticle(slug, articleDto, user.id);

        return {
            article: res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':slug')
    async deleteArticle(
        @Param('slug') slug: string,
        @User() user : RequestUser,
    ): Promise<void> {
        await this.articleService.deleteArticle(slug, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':slug/favorite')
    async favoriteArticle(
        @Param('slug') slug: string,
        @User() user : RequestUser,
    ): Promise<ArticleRO> {
        const res = await this.articleService.favoriteArticle(slug, user.id);

        return {
            article: res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':slug/favorite')
    async unfavoriteArticle(
        @Param('slug') slug: string,
        @User() user : RequestUser,
    ): Promise<ArticleRO> {
        const res = await this.articleService.unfavoriteArticle(slug, user.id);

        return {
            article: res
        }
    }


}
