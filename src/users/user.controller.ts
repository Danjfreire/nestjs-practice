import { Body, Controller, Get, Put, UseGuards, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRO } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('user')
export class UserController {

    constructor(
        private userService: UsersService,
        private authService : AuthService,
    ){}

    @UseGuards(JwtAuthGuard)
    @Get()
    async find(
        @Request() req
    ): Promise<UserRO> {
        const userDoc = await this.userService.findByEmail(req.user.email);
        const token = this.authService.generateJwtToken(userDoc);

        return {
            user : userDoc.toUserAuth(token),
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async update(
        @Body('user') userDto: UpdateUserDto,
        @Request() req
    ): Promise<UserRO> {
        const userDoc = await this.userService.update(req.user.email, userDto);
        const token = this.authService.generateJwtToken(userDoc);

        return {
            user : userDoc.toUserAuth(token),
        };
    }

}
