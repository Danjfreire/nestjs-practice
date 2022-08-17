import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto, User } from './models/user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService : AuthService
    ) { }

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    async login(
        @Request() req
    ) {
        return await this.authService.login(req.user)
    }

    @Post()
    async register(
        @Body() data: CreateUserDto
    ): Promise<User> {
        return await this.userService.register(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/test')
    getSomething(
        @Request() req
    ) {
        console.log('Beleza!')
        return req.user
    }

}
