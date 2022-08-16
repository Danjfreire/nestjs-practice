import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from '../auth/models/login.model';
import { CreateUserDto, User } from './models/user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private userService : UsersService,
        private authService : AuthService
    ){}

    @Post('/login')
    async login(
        @Body() data : LoginDto,
    ) : Promise<User> {
        return await this.authService.login(data);
    }

    @Post()
    async register(
        @Body() data : CreateUserDto
    ) : Promise<User> {
        return await this.userService.register(data);
    }
}
