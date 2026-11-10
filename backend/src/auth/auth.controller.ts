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
import { memoryStorage } from 'multer';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      storage: memoryStorage(),

      fileFilter: (req, file, callback) => {
        const tiposPermitidos = [
          'image/jpeg',
          'image/png',
          'image/webp'
        ];

        if (!tiposPermitidos.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Solo se permiten imágenes JPG, PNG o WEBP'
            ),
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
      dto.fotoPerfil = await this.cloudinaryService.subirImagen(
        archivo.buffer
      );
    }

    return this.authService.registrar(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}