import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto, User, UserData } from './models/user.model';

@Injectable()
export class UsersService {

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
        private authService : AuthService
    ) { }

    async register(data: CreateUserDto): Promise<User> {
        try {
            const hashedPassword = await this.authService.hashPassword(data.password);
            await this.db.collection('users')
                .insertOne({
                    username: data.username,
                    email: data.email,
                    password: hashedPassword
                })

            return {
                email: data.email,
                bio: '',
                image: '',
                token: 'token',
                username: data.username
            }
        } catch (error) {
            if(error.code === 11000) {
                throw new BadRequestException('Email already registered');
            }
            throw new BadRequestException('Failed to register user')
        }
    }

}
