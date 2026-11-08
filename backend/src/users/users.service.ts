import {
  Injectable,
  ConflictException,
  BadRequestException
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  // Buscar un usuario por su email.
  async buscarPorEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      email: email.toLowerCase()
    }).exec();
  }

  // Buscar un usuario por su username.
  async buscarPorUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      username
    }).exec();
  }

  // Buscar un usuario por su ID.
  async buscarPorId(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // Registrar un usuario nuevo.
  async crear(dto: CreateUserDto) {

    // Comprobar que las contraseñas coincidan.
    if (dto.password !== dto.confirmarPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Comprobar que el email o username no estén registrados.
    const usuarioExistente = await this.userModel.findOne({
      $or: [
        { email: dto.email.toLowerCase() },
        { username: dto.username }
      ]
    }).exec();

    if (usuarioExistente) {
      throw new ConflictException(
        'El email o nombre de usuario ya están registrados'
      );
    }

    // Hashear la contraseña.
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Crear el usuario en MongoDB.
    const usuario = await this.userModel.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email.toLowerCase(),
      username: dto.username,
      password: passwordHash,
      fechaNacimiento: new Date(dto.fechaNacimiento),
      descripcion: dto.descripcion,
      fotoPerfil: dto.fotoPerfil,
      rol: 'user',
      activo: true
    });

    // No devolver la contraseña en la respuesta.
    const { password, ...usuarioSeguro } = usuario.toObject();

    return usuarioSeguro;
  }
}