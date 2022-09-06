import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
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
    ): Promise<{user : UserAuth}> {
        const res = await this.authService.login(data.user.email, data.user.password);
        return {
            user : res
        }
    }

    @Post()
    async register(
        @Body() data: CreateUserDto
    ): Promise<{user : UserAuth}> {
        const res = await this.userService.register(data.user);
        return {
            user : res
        }
    }

}
