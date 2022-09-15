import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from '../articles/articles.module';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentSchema, Comment } from './schemas/comment.schema';


@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    ArticlesModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
})
export class CommentsModule {}
