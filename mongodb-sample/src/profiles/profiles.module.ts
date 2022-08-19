import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports : [UsersModule]
})
export class ProfilesModule {}
