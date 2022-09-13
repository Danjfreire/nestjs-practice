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

    async findProfileByUsername(username: string, requesterId: string) : Promise<Profile> {
        const currentUserDoc = await this.userService.findById(requesterId);
        const userDoc = await this.userService.findByUsername(username);

        return userDoc.toProfile(currentUserDoc);
    }

    async follow(username: string, currentUserId: string): Promise<Profile> {
        // check if user exists
        const user = await this.userService.findByUsername(username);

        const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: currentUserId },
            { $addToSet: { following: user._id } },
            { new: true }
        );

        return user.toProfile(updatedUser);
    }

    async unfollow(username: string, currentUserId: string): Promise<Profile> {
        const user = await this.userService.findByUsername(username);

        const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: currentUserId },
            { $pull: { following: user._id } },
            { new: true }
        );

        return user.toProfile(updatedUser);
    }

}
