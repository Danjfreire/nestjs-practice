import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { UsersModule } from 'src/users/users.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article, ArticleSchema } from './models/article.model';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports : [
    UsersModule,
    ProfilesModule,
    MongooseModule.forFeature([
      {name : Article.name, schema : ArticleSchema},
    ])
  ]
})
export class ArticlesModule {}
