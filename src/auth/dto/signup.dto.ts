import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class SignUpeAuthDto {
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly password: string;
}
