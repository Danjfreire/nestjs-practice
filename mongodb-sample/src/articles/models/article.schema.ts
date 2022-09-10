import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsOptional, IsString } from "class-validator";
import mongoose, { Document } from "mongoose";
import { User, UserDocument } from "src/users/models/user.schema";

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
    favoritesCount: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;

    toArticle: Function
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.methods.toArticle = function (requesterUser: UserDocument) {
    return {
        author: this.author.toProfile(requesterUser),
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        description: this.description,
        favoritesCount: this.favoritesCount,
        favorited: requesterUser ? requesterUser.favorites.includes(this._id) : false,
        slug: this.slug,
        tagList: this.tagList.sort(),
        title: this.title,
    }
}

