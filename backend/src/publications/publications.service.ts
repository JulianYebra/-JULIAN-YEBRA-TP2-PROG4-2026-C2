import {Injectable,ForbiddenException, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePublicationDto } from './dto/create-publication.dto';
import {Publication,PublicationDocument} from './publication.schema';
import { UsersService } from '../users/users.service';

    @Injectable()
    export class PublicationsService {

    constructor(
        @InjectModel(Publication.name)
        private readonly publicationModel: Model<PublicationDocument>,
        private readonly usersService: UsersService
    ) {}

    // Crear una publicación.
    async crear(dto: CreatePublicationDto, autorId: string) {

    const publicacion = await this.publicationModel.create({
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        imagen: dto.imagen || null,
        autor: new Types.ObjectId(autorId)
    });

    return publicacion;
    }

    async listar(
    orden: string = 'fecha',
    usuarioId?: string,
    offset: number = 0,
    limit: number = 10
    ) {
    const filtro: any = {
        activa: true
    };

    if (usuarioId) {
        if (!Types.ObjectId.isValid(usuarioId)) {
        throw new Error('El ID del usuario no es válido');
        }

        filtro.autor = new Types.ObjectId(usuarioId);
    }

    const publicaciones = await this.publicationModel
        .aggregate([
        {
            $match: filtro
        },
        {
            $addFields: {
            cantidadLikes: {
                $size: { $ifNull: ['$likes', []] }
            }
            }
        },
        {
            $sort: orden === 'likes'
            ? { cantidadLikes: -1, createdAt: -1 }
            : { createdAt: -1 }
        },
        {
            $skip: offset
        },
        {
            $limit: limit
        },
        {
            $lookup: {
            from: 'users',
            localField: 'autor',
            foreignField: '_id',
            as: 'autor'
            }
        },
        {
            $unwind: '$autor'
        },
        {
            $project: {
            'autor.password': 0
            }
        }
        ]);

    return publicaciones;
    }


  async darLike(publicacionId: string, usuarioId: string) {
    if (
      !Types.ObjectId.isValid(publicacionId) ||
      !Types.ObjectId.isValid(usuarioId)
    ) {
      throw new Error('ID de publicación o usuario inválido');
    }

    const publicacion = await this.publicationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(publicacionId),
        activa: true,
        likes: { $ne: new Types.ObjectId(usuarioId) }
      },
      {
        $addToSet: {
          likes: new Types.ObjectId(usuarioId)
        }
      },
      { new: true }
    );

    if (!publicacion) {
      const existe = await this.publicationModel.exists({
        _id: publicacionId,
        activa: true
      });

      if (!existe) {
        throw new Error('La publicación no existe');
      }

      throw new Error('El usuario ya dio like a esta publicación');
    }

    return publicacion;
  }


  async quitarLike(publicacionId: string, usuarioId: string) {
    if (
      !Types.ObjectId.isValid(publicacionId) ||
      !Types.ObjectId.isValid(usuarioId)
    ) {
      throw new Error('ID de publicación o usuario inválido');
    }

    const publicacion = await this.publicationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(publicacionId),
        activa: true,
        likes: new Types.ObjectId(usuarioId)
      },
      {
        $pull: {
          likes: new Types.ObjectId(usuarioId)
        }
      },
      { new: true }
    );

    if (!publicacion) {
      throw new Error('La publicación no existe o el usuario no dio like');
    }

    return publicacion;
  }


  async eliminar(publicacionId: string, usuarioId: string) {
    if (
      !Types.ObjectId.isValid(publicacionId) ||
      !Types.ObjectId.isValid(usuarioId)
    ) {
      throw new NotFoundException('ID inválido');
    }

    const publicacion = await this.publicationModel.findById(publicacionId);

    if (!publicacion || !publicacion.activa) {
      throw new NotFoundException('La publicación no existe');
    }

    const usuario = await this.usersService.buscarPorId(usuarioId);

    if (!usuario || !usuario.activo) {
      throw new NotFoundException('El usuario no existe o está inactivo');
    }

    const esAutor = publicacion.autor.toString() === usuarioId;
    const esAdministrador = usuario.perfil === 'administrador';

    if (!esAutor && !esAdministrador) {
      throw new ForbiddenException(
        'No tenés permisos para eliminar esta publicación'
      );
    }

    publicacion.activa = false;

    await publicacion.save();

    return {
      mensaje: 'Publicación eliminada correctamente'
    };
  }


}
