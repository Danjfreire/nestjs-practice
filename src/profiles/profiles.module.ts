import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';


@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
