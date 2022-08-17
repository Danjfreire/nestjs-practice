import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto, User } from './models/user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
    ) { }

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    async login(
        @Request() req
    ) {
        return req.user;
    }

    @Post()
    async register(
        @Body() data: CreateUserDto
    ): Promise<User> {
        return await this.userService.register(data);
    }
}
