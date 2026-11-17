import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from './users.service';
import { serializePublicUser } from './serializers/public-user.serializer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('El ID del usuario no es válido');
    }

    const usuario = await this.usersService.buscarPorId(id);

    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }

    return serializePublicUser(usuario);
  }
}
