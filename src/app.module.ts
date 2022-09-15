import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from "joi"
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';


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
