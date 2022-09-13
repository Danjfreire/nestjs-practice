import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from 'src/articles/schemas/article.schema';

@Injectable()
export class TagsService {

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async findAll() : Promise<string[]> {

    try {
      return  await this.articleModel.find().distinct('tagList').exec();
    } catch (error) {
      return []
    }

  }
}
