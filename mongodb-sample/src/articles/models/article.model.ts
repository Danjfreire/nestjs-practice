import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsOptional, IsString } from "class-validator";
import mongoose, { Document } from "mongoose";
import { User, UserDocument } from "src/users/models/user.model";

export type ArticleDocument = Article & Document;

@Schema()
export class Article {

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    body: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    tagList: string[];

    @Prop()
    createdAt: string;

    @Prop()
    updatedAt: string;

    @Prop()
    favorited: boolean;

    @Prop()
    favoriteCount: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;

    toJson: Function
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.methods.toJson = function (requesterUser: UserDocument) {
    return {
        author: this.author.toProfile(requesterUser),
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        description: this.description,
        favoritesCount: this.favoritesCount,
        favorited: requesterUser ? requesterUser.favorites.includes(this._id) : false,
        slug: this.slug,
        tagList: this.tagList,
        title: this.title,
    }
}


export class CreateArticleDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    body: string;

    @IsString({ each: true })
    tagList: string[];
}

export class UpdateArticleDto {

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    body?: string;
}

export interface ArticleQueryParams {
    favorited?: string,
    author?: string,
    tag?: string
}

export interface ArticleQueryOptions {
    query?: ArticleQueryParams,
    limit: number,
    offset: number,
}