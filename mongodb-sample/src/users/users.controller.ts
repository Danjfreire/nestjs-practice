import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserAuth } from 'src/auth/interfaces/user-auth.interface';
import { CreateUserDto } from './dto/create-user.dto';
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
    ): Promise<{ user: UserAuth }> {
        const res = await this.authService.login(data.user.email, data.user.password);
        return {
            user: res
        }
    }

    @Post()
    async register(
        @Body('user') userDto: CreateUserDto
    ): Promise<{ user: UserAuth }> {
        const res = await this.userService.register(userDto);
        return {
            user: res
        }
    }

}
