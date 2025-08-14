import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ description: 'The title of post', example: 'khmer'})
    @IsString()
    title: string;

    @ApiProperty({ description: 'The content of post', example: 'khmer rude 1995'})
    @IsString()
    content: string;
}