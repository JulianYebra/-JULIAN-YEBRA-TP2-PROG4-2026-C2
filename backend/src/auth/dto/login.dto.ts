import {
  IsString,
  IsNotEmpty,
  MinLength
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identificador: string;

  @IsString()
  @MinLength(8)
  password: string;
}