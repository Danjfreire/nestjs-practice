import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { Article, ArticleQueryOptions, CreateArticleDto } from './models/article.model';

@Controller('articles')
export class ArticlesController {

    constructor(
        private articleService : ArticlesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async asynccreateArticle(
        @Request() req,
        @Body() data : CreateArticleDto
    ) : Promise<Article> {
       const userId = req.user.id;
       
       console.log(data)
       console.log(userId)

       return await this.articleService.createArticle(userId, data);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':slug')
    async getArticle(
        @Request() req,
        @Param('slug') slug : string,
    ) : Promise<Article> {
       return await this.articleService.getArticle(slug, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async listArticles(
        @Query('tag') tag : string,
        @Query('author') author : string,
        @Query('favorited') favorited : string,
        @Query('limit') limit = 20,
        @Query('offset') offset = 0,
        @Request() req
    ) {

        const articleQueryOptions : ArticleQueryOptions = {
            query : {tag, author, favorited},
            limit,
            offset
        }

        return await this.articleService.listArticles(articleQueryOptions, req.user.id);
    }
}
