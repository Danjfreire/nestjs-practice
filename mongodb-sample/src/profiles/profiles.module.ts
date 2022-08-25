import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Follower, FollowerSchema } from './models/follower.model';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Follower.name, schema: FollowerSchema }])
  ]
})
export class ProfilesModule { }
