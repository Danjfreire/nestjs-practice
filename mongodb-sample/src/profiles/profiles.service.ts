import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
// import { Follower, FollowerDocument } from './models/follower.model';
import { Profile } from './interfaces/profile.model';

@Injectable()
export class ProfilesService {


    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private userService: UsersService
    ) { }

    async findProfileByUsername(username: string, requesterId: string) : Promise<{profile : Profile}> {
        const currentUser = await this.userService.findById(requesterId);
        const user = await this.userService.findByUsername(username);

        return {
            profile : user.toProfile((currentUser as UserDocument))
        };
    }

    async follow(username: string, currentUserId: string): Promise<{profile : Profile}> {
        // check if user exists
        const user = await this.userService.findByUsername(username);

        const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: currentUserId },
            { $addToSet: { following: (user as UserDocument)._id } },
            { new: true }
        );

        return {
            profile: user.toProfile((updatedUser as UserDocument))
        };
    }

    async unfollow(username: string, currentUserId: string): Promise<{profile : Profile}> {
        const user = await this.userService.findByUsername(username);

        const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: currentUserId },
            { $pull: { following: (user as UserDocument)._id } },
            { new: true }
        );

        return {
            profile : user.toProfile((updatedUser as UserDocument))
        };
    }

}
