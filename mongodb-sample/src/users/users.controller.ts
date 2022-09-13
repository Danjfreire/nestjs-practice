import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRO } from './interfaces/user.interface';
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
    ): Promise<UserRO> {
        const user = await this.authService.login(data.user.email, data.user.password);
        return {
            user : user
        }
    }

    @Post()
    async register(
        @Body('user') userDto: CreateUserDto
    ): Promise<UserRO> {
        const user = await this.userService.register(userDto);
        return {
            user: user
        }
    }

}
