import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { serializePublicUser } from '../users/serializers/public-user.serializer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  // Registrar un usuario.
  async registrar(dto: CreateUserDto) {
    return this.usersService.crear(dto);
  }

  async validarRegistro(dto: CreateUserDto): Promise<void> {
    return this.usersService.validarRegistro(dto);
  }

  // Iniciar sesión.
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

  const payload = {
    sub: usuario._id.toString(),
    email: usuario.email,
    username: usuario.username,
    perfil: usuario.perfil
  };

  const token = await this.jwtService.signAsync(payload);

  return {
    mensaje: 'Inicio de sesión exitoso',
    token,
    usuario: serializePublicUser(usuario)
  };
}

// Validar un token y devolver los datos del usuario.
async autorizar(token: string) {
  const payload = await this.verificarToken(token);

  const usuario = await this.usersService.buscarPorId(payload.sub);

  if (!usuario) {
    throw new UnauthorizedException('El usuario no existe');
  }

  return {
    mensaje: 'Token válido',
    usuario: serializePublicUser(usuario)
  };
}

// Renovar un token.
async refrescar(token: string) {
  const payload = await this.verificarToken(token);

  const usuario = await this.usersService.buscarPorId(payload.sub);

  if (!usuario) {
    throw new UnauthorizedException('El usuario no existe');
  }

  const nuevoToken = await this.jwtService.signAsync({
    sub: payload.sub,
    email: payload.email,
    username: payload.username,
    perfil: payload.perfil
  });

  return {
    mensaje: 'Token renovado correctamente',
    token: nuevoToken
  };
}

// Verificar que el token sea válido.
private async verificarToken(token: string): Promise<any> {
  if (!token || typeof token !== 'string') {
    throw new UnauthorizedException('Token no proporcionado');
  }

  try {
    return await this.jwtService.verifyAsync(token);
  } catch {
    throw new UnauthorizedException('Token inválido o vencido');
  }
}
}