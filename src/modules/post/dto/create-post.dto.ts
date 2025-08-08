import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({ description: 'The title of post', example: 'khmer'})
    title: string;

    @ApiProperty({ description: 'The content of post', example: 'khmer rude 1995'})
    content: string;
}