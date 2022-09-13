import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesService } from 'src/articles/articles.service';
import { ArticleDocument } from 'src/articles/schemas/article.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentJSON } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private articleService: ArticlesService,
    private userService: UsersService,
  ) {}

  async addComment(
    data: CreateCommentDto,
    articleSlug: string,
    authorId: string,
  ): Promise<CommentJSON> {
    const [user, article] = await Promise.all([
      await this.userService.findById(authorId),
      await this.articleService.findArticle(articleSlug),
    ]);

    if (article == null) {
      throw new NotFoundException('Article not found');
    }

    const now = new Date();

    const comment = await new this.commentModel({
      body: data.body,
      article: (article as ArticleDocument)._id,
      author: (user as UserDocument)._id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }).save();

    const populatedComment = await comment.populate('author');
    return populatedComment.toJSON(user);
  }

  async getComments(
    articleSlug: string,
    requesterId?: string,
  ): Promise<CommentJSON[]> {
    const [user, article] = await Promise.all([
      requesterId ? await this.userService.findById(requesterId) : null,
      await this.articleService.findArticle(articleSlug),
    ]);

    const comments = await this.commentModel
      .find({ article: (article as ArticleDocument)._id })
      .populate('author');

    return comments.map((comment) => comment.toJSON(user));
  }

  async deleteComment(commentId: string, requesterId): Promise<void> {
    try {
      const comment = await this.commentModel.findOne({ _id: commentId });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      if ((comment.author as any).toString() !== requesterId) {
        throw new ForbiddenException('No permission to delete comment');
      }

      await this.commentModel.deleteOne({ _id: commentId });
    } catch (error) {
      throw new NotFoundException('Comment not found');
    }
  }
}
