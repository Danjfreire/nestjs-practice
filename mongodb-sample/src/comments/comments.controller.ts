import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ArticlesService } from 'src/articles/articles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './models/comment.model';

@Controller('articles/:slug/comments')
export class CommentsController {

    constructor(
        private commentsService : CommentsService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('')
    async addComment(
        @Param('slug') slug : string,
        @Body() data : CreateCommentDto,
        @Request() req 
    ) {
        //check if
        console.log(req.user)
        const comment = await this.commentsService.addComment(data.comment, slug, req.user.id);

        return {
            comment
        }
    }    

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getComments(
        @Param('slug') slug : string,
        @Request() req
    ) {
        const comments = await this.commentsService.getComments(slug, req.user.id);

        return {
            comments
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteComment(
        @Param('id') commentId : string,
        @Request() req
    ) {
        await this.commentsService.deleteComment(commentId, req.user.id)
    }
}
