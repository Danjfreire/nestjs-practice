import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
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
        @Request() req,
        @Body('article') articleDto: CreateArticleDto
    ): Promise<ArticleRO> {
        const userId = req.user.id;

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
        @Request() req
    ): Promise<MultipleArticleRO> {
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
    ): Promise<ArticleRO> {
        const res = await this.articleService.getArticle(slug, req.user.id);

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
        @Request() req
    ): Promise<MultipleArticleRO> {

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
        @Body('article') articleDto: UpdateArticleDto,
        @Request() req
    ): Promise<ArticleRO> {
        const res = await this.articleService.updateArticle(slug, articleDto, req.user.id);

        return {
            article: res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':slug')
    async deleteArticle(
        @Param('slug') slug: string,
        @Request() req
    ): Promise<void> {
        await this.articleService.deleteArticle(slug, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':slug/favorite')
    async favoriteArticle(
        @Param('slug') slug: string,
        @Request() req
    ): Promise<ArticleRO> {
        const res = await this.articleService.favoriteArticle(slug, req.user.id);

        return {
            article: res
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':slug/favorite')
    async unfavoriteArticle(
        @Param('slug') slug: string,
        @Request() req
    ): Promise<ArticleRO> {
        const res = await this.articleService.unfavoriteArticle(slug, req.user.id);

        return {
            article: res
        }
    }


}
