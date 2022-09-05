import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LoginDto } from 'src/auth/models/login.dto';
import { UserAuth } from 'src/auth/models/user-auth.model';
import { CreateUserDto, UpdateUserDto } from './models/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @Post('/login')
    async login(
        @Body() data: LoginDto
    ): Promise<UserAuth> {
        return await this.authService.login(data.user.email, data.user.password);
    }

    @Post()
    async register(
        @Body() data: CreateUserDto
    ): Promise<UserAuth> {
        return await this.userService.register(data.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async find(
        @Request() req
    ): Promise<UserAuth> {
        const user = await this.userService.findByEmail(req.user.email);
        const token = req.headers.authorization.split(' ')[1];

        return {
            email: user.email,
            token,
            username: user.username,
            bio: user.bio ?? '',
            image: user.image ?? ''
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async update(
        @Body() data: UpdateUserDto,
        @Request() req
    ): Promise<UserAuth> {
        const userData = await this.userService.update(req.user.email, data);

        const user: UserAuth = {
            bio: userData?.bio ?? '',
            email: userData.email,
            image: userData?.image ?? '',
            username: userData.username,
            token: req.headers.authorization.split(' ')[1],
        }

        return user;
    }

}
