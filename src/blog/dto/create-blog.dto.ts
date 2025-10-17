import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @Length(3, 255)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  image_url?: string;
}
