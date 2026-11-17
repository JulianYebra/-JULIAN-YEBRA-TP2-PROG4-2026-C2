
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength
} from 'class-validator';

export class CreatePublicationDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  descripcion: string;

  @IsOptional()
  @IsString()
  imagen?: string;
}
