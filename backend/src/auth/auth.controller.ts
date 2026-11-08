import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  // Endpoint para registrar usuarios.
  @Post('register')
  async registrar(@Body() dto: CreateUserDto) {
    return this.authService.registrar(dto);
  }

}