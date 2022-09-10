import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/articles/models/article.schema';

@Module({
  controllers: [TagsController],
  imports : [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
    ])
  ],
  providers: [TagsService]
})
export class TagsModule {}
