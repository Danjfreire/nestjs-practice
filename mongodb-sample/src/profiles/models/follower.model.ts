import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "src/users/models/user.model";

export interface FollowerData {
    followUsername: string;
    followerUsername: string;
}

export type FollowerDocument = Follower & mongoose.Document;

@Schema()
export class Follower {

    @Prop({ required: true, index: true, type : mongoose.Schema.Types.ObjectId, ref : 'User' })
    followerId: string;

    @Prop({ required: true, index: true, type : mongoose.Schema.Types.ObjectId, ref : 'User' })
    followingId: string;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);