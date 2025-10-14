import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsHexColor,
  IsUrl,
} from 'class-validator';

export class CreateHeroDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  ctaText?: string;

  @IsBoolean()
  @IsOptional()
  showText?: boolean;

  @IsString()
  @IsOptional()
  ctaLink?: string;

  @IsNumber()
  @IsOptional()
  overlayOpacity?: number;

  @IsHexColor()
  @IsOptional()
  textColor?: string;

  @IsHexColor()
  @IsOptional()
  ctaColor?: string;

  @IsHexColor()
  @IsOptional()
  ctaTextColor?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
