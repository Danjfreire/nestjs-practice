import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ArticlesModule } from './articles/articles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from "joi"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema : Joi.object({
        JWT_SECRET: Joi.string().required(),
        DB_CONNECTION_URI: Joi.string().required()
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri : configService.get<string>('DB_CONNECTION_URI')
      }),
      inject: [ConfigService]
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017'),
    UsersModule,
    AuthModule,
    ProfilesModule,
    ArticlesModule,
    CommentsModule,
    TagsModule,
  ],
  providers: [],
})
export class AppModule { }
