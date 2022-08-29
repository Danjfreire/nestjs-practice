import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { Follower, FollowerDocument } from './models/follower.model';
import { Profile } from './models/profile.model';

@Injectable()
export class ProfilesService {


    constructor(
        @InjectModel(Follower.name) private followerModel: Model<FollowerDocument>,
        private userService: UsersService
    ) { }

    async findProfileById(userId : string, requesterId : string) : Promise<Profile> {
        const user = await this.userService.findById(userId);
        const isFollower = await this.followerModel.findOne({ followingId: (user as UserDocument)._id, followerId : requesterId}, '-_id');

        return {
            username: user.username,
            bio: user.bio ?? '',
            image: user.image ?? '',
            following: isFollower != null
        }
    }

    async findProfileByUsername(username: string, requesterId: string): Promise<Profile> {
        const user = await this.userService.findByUsername(username);
        const isFollower = await this.followerModel.findOne({ followingId: (user as UserDocument)._id, followerId : requesterId});

        return {
            username: user.username,
            bio: user.bio ?? '',
            image: user.image ?? '',
            following: isFollower != null
        }
    }

    async follow(username: string, followerId: string): Promise<Profile> {
        // check if user exists
        const user = await this.userService.findByUsername(username);

        await new this.followerModel({followerId, followingId : (user as UserDocument)._id}).save();

        return {
            bio: user.bio ?? '',
            image: user.image ?? '',
            username: user.username,
            following: true
        }
    }

    async unfollow(username: string, followerId: string): Promise<Profile> {
        const user = await this.userService.findByUsername(username);

        await this.followerModel.deleteOne({followerId, followingId : (user as UserDocument)._id })

        return {
            bio: user.bio ?? '',
            image: user.image ?? '',
            username: user.username,
            following: false
        }
    }

}
