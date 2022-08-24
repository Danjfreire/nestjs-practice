import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserAuth } from 'src/users/models/user.model';
import * as argon2 from "argon2";
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './models/login.model';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private userService: UsersService
    ) { }


    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findByEmail(email);
        //check if password matches
        if (!await argon2.verify(user.password, password)) {
           throw new BadRequestException('Invalid email or password');
        }

        return user;
    }

    async login(data : LoginDto) : Promise<UserAuth> {
        const user = await this.validateUser(data.email, data.password);
        const payload = { username: user.username, sub: user.email }
        const token = this.jwtService.sign(payload);

        return {
            email: user.email,
            username: user.username,
            bio: user.bio || '',
            image: user.image || '',
            token,
        }
    }

    async hashPassword(password : string) {
        return await argon2.hash(password)
    }

}
