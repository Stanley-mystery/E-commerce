import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  // @IsStrongPassword()
  @IsNotEmpty()
  readonly password: string;
}
