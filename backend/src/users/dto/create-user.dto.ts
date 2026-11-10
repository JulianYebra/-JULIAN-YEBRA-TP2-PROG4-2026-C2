import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsDate,
  IsOptional,
  Matches,
  MaxDate
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

export class CreateUserDto {

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'El nombre debe tener al menos 3 caracteres'
  })
  nombre: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'El apellido debe tener al menos 3 caracteres'
  })
  apellido: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  confirmarPassword: string;

  @Type(() => Date)
  @IsDate({
    message: 'Ingresá una fecha de nacimiento válida'
  })
  @MaxDate(new Date(), {
    message: 'La fecha de nacimiento no puede ser futura'
  })
  fechaNacimiento: Date;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;
}