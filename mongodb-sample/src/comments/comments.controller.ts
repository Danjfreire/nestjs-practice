import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AnonymousAuthGuard } from 'src/auth/guards/anonymous-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRO, MultipleCommentRO } from './interfaces/comment.interface';

@Controller('articles/:slug/comments')
export class CommentsController {

    constructor(
        private commentsService : CommentsService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('')
    async addComment(
        @Param('slug') slug : string,
        @Body('comment') commentDto : CreateCommentDto,
        @Request() req 
    ) : Promise<CommentRO> {
        //check if
        const comment = await this.commentsService.addComment(commentDto, slug, req.user.id);

        return {
            comment
        }
    }    

    @UseGuards(AnonymousAuthGuard)
    @Get('')
    async getComments(
        @Param('slug') slug : string,
        @Request() req
    ) : Promise<MultipleCommentRO> {
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
