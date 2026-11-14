
import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Delete
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UsersService } from '../users/users.service';

@Controller('publications')
export class PublicationsController {
  constructor(
    private readonly publicationsService: PublicationsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService
  ) {}

  // Crear una publicación.
  @Post(':autorId')
  @UseInterceptors(
    FileInterceptor('imagen', {
      limits: {
        fileSize: 5 * 1024 * 1024
      },
      fileFilter: (req, file, callback) => {
        const tiposPermitidos = [
          'image/jpeg',
          'image/png',
          'image/webp'
        ];

        if (!tiposPermitidos.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'El formato de imagen no está permitido'
            ),
            false
          );
        }

        callback(null, true);
      }
    })
  )
  async crear(
    @Param('autorId') autorId: string,
    @Body() dto: CreatePublicationDto,
    @UploadedFile() imagen?: Express.Multer.File
  ) {
    const usuario = await this.usersService.buscarPorId(autorId);

    if (!usuario || !usuario.activo) {
      throw new NotFoundException('El usuario no existe o está inactivo');
    }

    let imagenUrl: string | null = null;

    if (imagen) {
      imagenUrl = await this.cloudinaryService.subirImagenPublicacion(
        imagen.buffer
      );
    }

    return this.publicationsService.crear(
    {
        ...dto,
        imagen: imagenUrl ?? undefined
    },
    autorId
    );
  }

  @Get()
  async listar(
    @Query('orden') orden: string = 'fecha',
    @Query('usuarioId') usuarioId?: string,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
  ) {
    const limiteSeguro = Math.min(Math.max(limit ?? 10, 1), 50);
    const desplazamientoSeguro = Math.max(offset ?? 0, 0);

    return this.publicationsService.listar(
      orden,
      usuarioId,
      desplazamientoSeguro,
      limiteSeguro
    );
  }


  // Dar like a una publicación.
  @Post(':publicacionId/likes/:usuarioId')
  async darLike(
    @Param('publicacionId') publicacionId: string,
    @Param('usuarioId') usuarioId: string
  ) {
    return this.publicationsService.darLike(
      publicacionId,
      usuarioId
    );
  }

  @Delete(':publicacionId/likes/:usuarioId')
  async quitarLike(
    @Param('publicacionId') publicacionId: string,
    @Param('usuarioId') usuarioId: string
  ) {
    return this.publicationsService.quitarLike(
      publicacionId,
      usuarioId
    );
  }

  @Delete(':publicacionId/:usuarioId')
  async eliminar(
    @Param('publicacionId') publicacionId: string,
    @Param('usuarioId') usuarioId: string
  ) {
    return this.publicationsService.eliminar(
      publicacionId,
      usuarioId
    );
  }

}
