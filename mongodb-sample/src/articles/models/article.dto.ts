import { Type } from "class-transformer";
import { IsString, IsOptional, IsDefined, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";

export class ArticleRegisterData {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    body: string;

    @IsString({ each: true })
    tagList: string[];
}

export class CreateArticleDto {

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => ArticleRegisterData)
    article : ArticleRegisterData
   
}

export class UpdateArticleData {
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

export class UpdateArticleDto {

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateArticleData)
    article : UpdateArticleData
   
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