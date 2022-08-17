import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/models/login.model';
import { User, UserData } from 'src/users/models/user.model';
import * as argon2 from "argon2";
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private userService: UsersService
    ) { }


    async validateUser(email: string, password: string): Promise<UserData | null> {
        const user = await this.userService.findByEmail(email);

        //check if password matches
        if (!user) {
            return null
        }

        if (!await argon2.verify(user.password, password)) {
            return null;
        }

        return user;
    }

    async login(user: UserData) {
        const payload = { username: user.username, email: user.email, sub: user._id }
        const token = this.jwtService.sign(payload);

        return {
            email: user.email,
            username: user.username,
            bio: user.bio || '',
            image: user.image || '',
            token,
        }
    }

}
