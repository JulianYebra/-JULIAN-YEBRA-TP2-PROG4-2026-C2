import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService
  ) {}

  // Registrar un usuario.
  async registrar(dto: CreateUserDto) {
    return this.usersService.crear(dto);
  }

}