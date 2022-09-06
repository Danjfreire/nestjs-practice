import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Article } from "src/articles/models/article.schema";
import { User, UserDocument } from "src/users/models/user.schema";

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {

    @Prop({ required: true })
    body: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Article' })
    article: Article;

    @Prop({ required: true })
    createdAt: string;

    @Prop({ required: true })
    updatedAt: string;

    toJson : Function
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

CommentSchema.methods.toJson = function(referenceUser : UserDocument) {
    return {
        id : this._id,
        createdAt : this.createdAt,
        updatedAt : this.updatedAt,
        body : this.body,
        author : this.author.toProfile(referenceUser)
    }
}