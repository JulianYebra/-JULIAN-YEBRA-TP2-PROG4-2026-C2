
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';

import { PublicationsService } from './publications.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('publications/:publicacionId/comentarios')
export class CommentsController {

  constructor(
    private readonly publicationsService: PublicationsService
  ) {}

  // Obtener comentarios de una publicación.
  @Get()
  async listar(
    @Param('publicacionId') publicacionId: string,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    const limiteSeguro = Math.min(Math.max(limit, 1), 50);
    const desplazamientoSeguro = Math.max(offset, 0);

    return this.publicationsService.listarComentarios(
      publicacionId,
      desplazamientoSeguro,
      limiteSeguro
    );
  }

  // Agregar un comentario.
  @Post(':usuarioId')
  async crear(
    @Param('publicacionId') publicacionId: string,
    @Param('usuarioId') usuarioId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.publicationsService.comentar(
      publicacionId,
      usuarioId,
      dto
    );
  }

  // Editar un comentario propio.
  @Put(':comentarioId/:usuarioId')
  async editar(
    @Param('publicacionId') publicacionId: string,
    @Param('comentarioId') comentarioId: string,
    @Param('usuarioId') usuarioId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.publicationsService.editarComentario(
      publicacionId,
      comentarioId,
      usuarioId,
      dto
    );
  }
}
