import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { ArticleQueryOptions, CreateArticleDto, UpdateArticleDto } from './models/article.dto';
import { Article } from './models/article.schema';

@Controller('articles')
export class ArticlesController {

    constructor(
        private articleService: ArticlesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArticle(
        @Request() req,
        @Body() data: CreateArticleDto
    ) {
        const userId = req.user.id;

        const res = await this.articleService.createArticle(userId, data.article);

        return {
            article : res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('feed')
    async getFeed(
        @Query('limit') limit = 20,
        @Query('offset') offset = 0,
        @Request() req
    ) {
        const articleQueryOptions: ArticleQueryOptions = {
            limit,
            offset
        }

        return await this.articleService.getArticlesFeed(articleQueryOptions, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':slug')
    async getArticle(
        @Request() req,
        @Param('slug') slug: string,
    ) {
        const res = await this.articleService.getArticle(slug, req.user.id);

        return {
            article: res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async listArticles(
        @Query('tag') tag: string,
        @Query('author') author: string,
        @Query('favorited') favorited: string,
        @Query('limit') limit = 20,
        @Query('offset') offset = 0,
        @Request() req
    ) {

        const articleQueryOptions: ArticleQueryOptions = {
            query: { tag, author, favorited },
            limit,
            offset
        }

        return await this.articleService.listArticles(articleQueryOptions, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':slug')
    async updateArticle(
        @Param('slug') slug: string,
        @Body() data: UpdateArticleDto,
        @Request() req
    ) {
        const res =  await this.articleService.updateArticle(slug, data.article, req.user.id);

        return {
            article : res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':slug')
    async deleteArticle(
        @Param('slug') slug: string,
        @Request() req
    ) {
        await this.articleService.deleteArticle(slug, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':slug/favorite')
    async favoriteArticle(
        @Param('slug') slug: string,
        @Request() req
    ) {
        const res = await this.articleService.favoriteArticle(slug, req.user.id);

        return {
            article : res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':slug/favorite')
    async unfavoriteArticle(
        @Param('slug') slug: string,
        @Request() req
    ) {
        const res = await this.articleService.unfavoriteArticle(slug, req.user.id);

        return {
            article : res
        }
    }


}
