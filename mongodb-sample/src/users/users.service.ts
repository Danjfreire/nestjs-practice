import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { CreateUserDto, UpdateUserDto, User, UserData } from './models/user.model';
import * as argon2 from 'argon2'
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {

    private userCollection: Collection<UserData>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) {
        this.userCollection = this.db.collection('users');
    }

    async register(data: CreateUserDto): Promise<User> {
        try {
            const hashedPassword = await argon2.hash(data.password);
            await this.userCollection
                .insertOne({
                    username: data.username,
                    email: data.email,
                    password: hashedPassword
                })

            const user = await this.authService.validateUser(data.email, data.password)

            return await this.authService.login(user)
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException('Email already registered');
            } else {
                throw new BadRequestException('Failed to register user')
            }
        }
    }

    async findByEmail(email: string): Promise<UserData> {
        const user = await this.userCollection.findOne({ email });

        if(!user) {
            throw new NotFoundException('User not found')
        }

        return user;
    }

    async update(email : string, data : UpdateUserDto) : Promise<UserData> {
        if(data.password) {
            data.password = await argon2.hash(data.password)
        }

        await this.userCollection.updateOne({email : email}, {$set : data});

        return await this.findByEmail(data.email ?? email);
    }

}
