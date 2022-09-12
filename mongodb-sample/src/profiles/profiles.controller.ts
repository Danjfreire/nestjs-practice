import { Controller, Delete, Get, Param, Post, Request, UseGuards, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Profile } from './models/profile.model';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {

    constructor(
        private profileService: ProfilesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get(':username')
    async findProfile(
        @Param('username') username: string,
        @Request() req
    ): Promise<{ profile: Profile }> {
        return await this.profileService.findProfileByUsername(username, req.user.id);
    }

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Post(':username/follow')
    async followProfile(
        @Param('username') username: string,
        @Request() req
    ): Promise<{ profile: Profile }> {
        return await this.profileService.follow(username, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':username/follow')
    async unfollowProfile(
        @Param('username') username: string,
        @Request() req
    ): Promise<{ profile: Profile }> {
        return await this.profileService.unfollow(username, req.user.id);
    }

}
