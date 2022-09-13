import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequestUser, User } from 'src/auth/decorators/user.decorator';
import { AnonymousAuthGuard } from 'src/auth/guards/anonymous-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRO, MultipleCommentRO } from './interfaces/comment.interface';

@Controller('articles/:slug/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async addComment(
    @Param('slug') slug: string,
    @Body('comment') commentDto: CreateCommentDto,
    @User() user: RequestUser,
  ): Promise<CommentRO> {
    const comment = await this.commentsService.addComment(
      commentDto,
      slug,
      user.id,
    );

    return {
      comment,
    };
  }

  @UseGuards(AnonymousAuthGuard)
  @Get('')
  async getComments(
    @Param('slug') slug: string,
    @User() user: RequestUser,
  ): Promise<MultipleCommentRO> {
    const comments = await this.commentsService.getComments(slug, user.id);

    return {
      comments,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteComment(
    @Param('id') commentId: string,
    @User() user: RequestUser,
  ) {
    await this.commentsService.deleteComment(commentId, user.id);
  }
}
