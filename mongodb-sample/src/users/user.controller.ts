import { Body, Controller, Get, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAuth } from 'src/auth/models/user-auth.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRO } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('user')
export class UserController {

    constructor(
        private userService: UsersService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get()
    async find(
        @Request() req
    ): Promise<UserRO> {
        const userData = await this.userService.findByEmail(req.user.email);
        const token = req.headers.authorization.split(' ')[1];

        const user: UserAuth = {
            bio: userData?.bio ?? '',
            email: userData.email,
            image: userData?.image ?? '',
            username: userData.username,
            token,
        }

        return {
            user : user
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async update(
        @Body('user') userDto: UpdateUserDto,
        @Request() req
    ): Promise<UserRO> {
        const userData = await this.userService.update(req.user.email, userDto);

        const user: UserAuth = {
            bio: userData?.bio ?? '',
            email: userData.email,
            image: userData?.image ?? '',
            username: userData.username,
            token: req.headers.authorization.split(' ')[1],
        }

        return {
            user : user
        };
    }

}
