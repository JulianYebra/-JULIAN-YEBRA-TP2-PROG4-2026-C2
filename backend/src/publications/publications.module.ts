
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import {Publication,PublicationSchema} from './publication.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
  MongooseModule.forFeature([
    {
      name: Publication.name,
      schema: PublicationSchema
    }
  ]),
  CloudinaryModule,
  UsersModule
  ],
  providers: [PublicationsService],
  controllers: [PublicationsController]
})
export class PublicationsModule {}
