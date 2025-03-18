import { IsInt, IsPositive, IsString } from 'class-validator';

export class PlayerValidationDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  code: number;

  @IsString()
  match_code: string;
}
