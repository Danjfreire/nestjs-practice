import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer"

export class CommentDto {
    
    @IsNotEmpty()
    @IsString()
    body : string;
}

export class CreateCommentDto {

    @IsDefined()
    @Type(() => CommentDto)
    comment: CommentDto
}

