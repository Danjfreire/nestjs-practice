import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose from "mongoose";

export type ArticleDocument = Article & Document;

@Schema()
export class Article {

    @Prop({required : true, unique : true})
    slug : string;

    @Prop({required : true})
    title : string;

    @Prop({required : true})
    body : string;

    @Prop({required : true})
    description : string;

    @Prop()
    tagList : string[];

    @Prop()
    createdAt : string;

    @Prop()
    updatedAt : string;

    @Prop()
    favorited : boolean;

    @Prop()
    favoriteCount : number;

    @Prop({type : mongoose.Schema.Types.ObjectId, ref : 'User'})
    author;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);


export type FavoriteArticleDocument = FavoriteArticle & Document;

@Schema()
export class FavoriteArticle {

    @Prop({type : mongoose.Schema.Types.ObjectId, ref : 'User'})
    userId : mongoose.Schema.Types.ObjectId;

    @Prop({type : mongoose.Schema.Types.ObjectId, ref : 'Article'})
    articleId : mongoose.Schema.Types.ObjectId;
}

export const FavoriteArticleSchema = SchemaFactory.createForClass(FavoriteArticle)


// export interface ArticleData {
//     slug: string;
//     title: string;
//     description: string;
//     body: string;
//     tagList: string[];
//     createdAt: string;
//     updatedAt: string;
//     favoritesCount: number;
//     author : string;
// }

// export interface Article {
//     slug: string;
//     title: string;
//     description: string;
//     body: string;
//     tagList: string[];
//     createdAt: string;
//     updatedAt: string;
//     favorited: boolean;
//     favoritesCount: number;
//     author: {
//         username: string;
//         bio: string;
//         image: string;
//         following: false;
//     }
// }

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