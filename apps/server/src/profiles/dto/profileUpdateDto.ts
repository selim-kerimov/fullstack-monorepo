import { IsOptional, IsString, Length } from 'class-validator';

export class ProfileUpdateDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  firstName: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  lastName: string;
}
