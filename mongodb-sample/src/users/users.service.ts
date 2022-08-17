import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { CreateUserDto, User, UserData } from './models/user.model';
import * as argon2 from 'argon2'

@Injectable()
export class UsersService {

    private userCollection: Collection<UserData>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
    ) {
        this.userCollection = this.db.collection('users');
    }

    async register(data: CreateUserDto): Promise<User> {
        try {
            const hashedPassword = await argon2.hash(data.password);
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
            if (error.code === 11000) {
                throw new BadRequestException('Email already registered');
            }
            throw new BadRequestException('Failed to register user')
        }
    }

    async findByEmail(email: string): Promise<UserData | null> {
        return await this.userCollection.findOne({ email });
    }

}
