import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ProfilesModule, ArticlesModule],
  providers: [],
})
export class AppModule {}
