import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { Article, ArticleQueryOptions, CreateArticleDto, UpdateArticleDto } from './models/article.model';

@Controller('articles')
export class ArticlesController {

    constructor(
        private articleService: ArticlesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async asynccreateArticle(
        @Request() req,
        @Body() data: CreateArticleDto
    ): Promise<Article> {
        const userId = req.user.id;

        console.log(data)
        console.log(userId)

        return await this.articleService.createArticle(userId, data);
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
    ): Promise<Article> {
        console.log(req.user)
        return await this.articleService.getArticle(slug, req.user.id);
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
        return await this.articleService.updateArticle(slug, data, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':slug')
    async deleteArticle(
        @Param('slug') slug: string,
        @Request() req
    ) {
        await this.articleService.deleteArticle(slug, req.user.id);
    }

}
