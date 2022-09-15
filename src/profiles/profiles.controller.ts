import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { RequestUser, User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileRO } from './interfaces/profile.model';
import { ProfilesService } from './profiles.service';


@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findProfile(
    @Param('username') username: string,
    @User() user: RequestUser,
  ): Promise<ProfileRO> {
    const profile = await this.profileService.findProfileByUsername(
      username,
      user.id,
    );

    return {
      profile,
    };
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post(':username/follow')
  async followProfile(
    @Param('username') username: string,
    @User() user: RequestUser,
  ): Promise<ProfileRO> {
    const profile = await this.profileService.follow(username, user.id);

    return {
      profile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username/follow')
  async unfollowProfile(
    @Param('username') username: string,
    @User() user: RequestUser,
  ): Promise<ProfileRO> {
    const profile = await this.profileService.unfollow(username, user.id);

    return {
      profile,
    };
  }
}
