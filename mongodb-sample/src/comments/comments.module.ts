import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ArticlesModule } from 'src/articles/articles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    ArticlesModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
  ]
})
export class CommentsModule { }
