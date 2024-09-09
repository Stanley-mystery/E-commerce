import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyPasswordDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  password: string;
}

// export class UserResponseDto {
//   id: number;
//   name: string;
//   email: string;
//   imageUrl: string;

//   constructor(id: number, name: string, email: string, imagePath: string) {
//     this.id = id;
//     this.name = name;
//     this.email = email;
//     this.imageUrl = `http://localhost:3001/images/${imagePath}`;
//   }
// }
