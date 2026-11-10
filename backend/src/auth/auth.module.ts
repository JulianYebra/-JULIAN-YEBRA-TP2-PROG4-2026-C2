import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [UsersModule,CloudinaryModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}