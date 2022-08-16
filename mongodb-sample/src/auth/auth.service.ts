import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Db } from 'mongodb';
import { LoginDto } from 'src/auth/models/login.model';
import { User, UserData } from 'src/users/models/user.model';
import * as argon2 from "argon2";

@Injectable()
export class AuthService {

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
        private jwtService: JwtService
    ) { }

    async login(data: LoginDto): Promise<User> {
        const user = await this.db.collection('users')
            .findOne<UserData>({ email: data.email })

        //check if password matches
        if (!user) {
            throw new BadRequestException('Invalid email and/or password');
        }

        if (!await argon2.verify(user.password, data.password)) {
            throw new BadRequestException('Invalid email and/or password')
        }

        const payload = { username: user.username, sub: user._id }
        const token = this.jwtService.sign(payload);

        return {
            email: user.email,
            username: user.username,
            bio: user.bio || '',
            image: user.image || '',
            token,
        }
    }

    async hashPassword(pwd : string) : Promise<string> {
        return await argon2.hash(pwd);
    }

}
