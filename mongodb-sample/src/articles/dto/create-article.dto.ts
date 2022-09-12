import { Type } from "class-transformer";
import { IsString, IsOptional, IsDefined, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";

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


