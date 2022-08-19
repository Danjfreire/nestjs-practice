import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
        @Param('username') username : string,
        @Request() req
    ) : Promise<Profile> {
        console.log(username)
        console.log(req.user.username)
        return await this.profileService.findProfileByUsername(username, req.user.username);
    }

}
