import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsDateString,
  IsOptional,
  Matches
} from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe contener al menos una mayúscula y un número'
  })
  password: string;

  @IsString()
  confirmarPassword: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;
}