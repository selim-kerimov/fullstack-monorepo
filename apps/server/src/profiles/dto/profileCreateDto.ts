import { IsString, Length } from 'class-validator';

export class ProfileCreateDto {
  @IsString()
  @Length(3, 100)
  firstName: string;

  @IsString()
  @Length(3, 100)
  lastName: string;
}
