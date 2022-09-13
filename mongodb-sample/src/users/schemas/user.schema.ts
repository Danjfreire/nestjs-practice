import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Profile } from "src/profiles/interfaces/profile.model";


export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
    following: string[];

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }])
    favorites: string[];

    @Prop()
    bio: string;

    @Prop()
    image: string;

    @Prop({ required: true })
    password: string;

    toProfile: (referenceUser : UserDocument) => Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toProfile = function (referenceUser: UserDocument): Profile {
    return {
        username: this.username,
        bio: this.bio ?? '',
        image: this.image ?? '',
        following: referenceUser ? referenceUser.following.includes(this._id) : false,
    }
}


