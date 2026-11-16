
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {

  @IsString({ message: 'El comentario debe ser un texto' })
  @MinLength(1, { message: 'El comentario no puede estar vacío' })
  @MaxLength(500, { message: 'El comentario no puede superar los 500 caracteres' })
  texto: string;
}
