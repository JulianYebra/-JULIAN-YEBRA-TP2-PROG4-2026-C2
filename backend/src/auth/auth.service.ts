import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService
  ) {}

  // Registrar un usuario.
  async registrar(dto: CreateUserDto) {
    return this.usersService.crear(dto);
  }

  // Iniciar sesión.
  async login(dto: LoginDto) {
    const identificador = dto.identificador.trim();

    const usuario = identificador.includes('@')
      ? await this.usersService.buscarPorEmail(identificador)
      : await this.usersService.buscarPorUsername(identificador);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordValida = await bcrypt.compare(
      dto.password,
      usuario.password
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return {
    mensaje: 'Inicio de sesión exitoso',
    usuario: {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      username: usuario.username,
      perfil: usuario.perfil,
      descripcion: usuario.descripcion,
      fotoPerfil: usuario.fotoPerfil
    }
  };
  }
}