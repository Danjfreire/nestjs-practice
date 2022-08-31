import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsOptional, IsString } from "class-validator";
import mongoose, { Document } from "mongoose";
import { Article } from "src/articles/models/article.model";


export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop([{type : mongoose.Schema.Types.ObjectId, ref : 'User'}])
    following : string[];

    @Prop([{type : mongoose.Schema.Types.ObjectId, ref : 'Article'}])
    favorites : string[];

    @Prop()
    bio: string;

    @Prop()
    image : string;

    @Prop({ required: true })
    password: string;

    toProfile : Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toProfile = function(referenceUser : UserDocument) {
    return {
        username: this.username,
        bio: this.bio ?? '',
        image: this.image ?? '',
        following: referenceUser.following.includes(this._id),
    }
}


export interface UserAuth {
    email: string;
    token: string;
    username: string;
    bio?: string;
    image?: string;
}

export class CreateUserDto {

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UpdateUserDto {

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    image?: string;
    

}