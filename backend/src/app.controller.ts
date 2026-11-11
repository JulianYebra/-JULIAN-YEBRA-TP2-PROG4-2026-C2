import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getEstado() {
    return {
      mensaje: 'API de Red Social funcionando correctamente',
      estado: 'activo'
    };
  }
}