import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Article, ArticleSchema } from '../articles/schemas/article.schema';


@Module({
  controllers: [TagsController],
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  providers: [TagsService],
})
export class TagsModule {}
