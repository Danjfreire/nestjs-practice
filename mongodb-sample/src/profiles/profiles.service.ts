import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { UsersService } from 'src/users/users.service';
import { FollowerData } from './models/follower.model';
import { Profile } from './models/profile.model';

@Injectable()
export class ProfilesService {

    followerCollection: Collection<FollowerData>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private db: Db,
        private userService: UsersService
    ) {
        this.followerCollection = db.collection('followers');
    }

    // async findProfileByUsername(username: string, requesterUsername: string): Promise<Profile> {
    //     const user = await this.userService.findByUsername(username);
    //     const isFollower = await this.followerCollection.findOne({ followUsername: username, followerUsername: requesterUsername });

    //     return {
    //         username: user.username,
    //         bio: user.bio ?? '',
    //         image: user.image ?? '',
    //         following: isFollower != null
    //     }
    // }

    // async follow(username: string, followerUsername: string): Promise<Profile> {
    //     // check if user exists
    //     const user = await this.userService.findByUsername(username);

    //     await this.followerCollection.insertOne({ followUsername: username, followerUsername });

    //     return {
    //         bio: user.bio ?? '',
    //         image: user.image ?? '',
    //         username: user.username,
    //         following: true
    //     }
    // }

    // async unfollow(username: string, followerUsername: string): Promise<Profile> {
    //     const user = await this.userService.findByUsername(username);

    //     const followerData = await this.followerCollection.findOneAndDelete({ followUsername: username, followerUsername });
    //     console.log(followerData);

    //     return {
    //         bio: user.bio ?? '',
    //         image: user.image ?? '',
    //         username: user.username,
    //         following: false
    //     }
    // }

}
