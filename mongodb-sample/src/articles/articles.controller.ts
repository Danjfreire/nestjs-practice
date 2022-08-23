import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { Article, CreateArticleDto } from './models/article.model';

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
    ) {
       const username = req.user.username;
       
       return await this.articleService.createArticle(username, data);
    }

    @Get(':slug')
    async getArticle(
        @Param('slug') slug : string,
    ) : Promise<Article> {
       return await this.articleService.getArticle(slug);
    }


}
