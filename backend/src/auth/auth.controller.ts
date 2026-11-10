import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  // Registrar usuarios y recibir su foto de perfil.
  @Post('register')
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, callback) => {
          const nombreArchivo = `${randomUUID()}${extname(file.originalname)}`;
          callback(null, nombreArchivo);
        }
      }),
      fileFilter: (req, file, callback) => {
        const tiposPermitidos = [
          'image/jpeg',
          'image/png',
          'image/webp'
        ];

        if (!tiposPermitidos.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP'),
            false
          );
        }

        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024
      }
    })
  )
  async registrar(
    @Body() dto: CreateUserDto,
    @UploadedFile() archivo?: Express.Multer.File
  ) {
    if (archivo) {
      dto.fotoPerfil = `/uploads/perfiles/${archivo.filename}`;
    }

    return this.authService.registrar(dto);
  }

  // Iniciar sesión.
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}