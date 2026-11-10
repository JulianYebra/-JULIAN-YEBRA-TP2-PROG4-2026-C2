import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME'
      ),
      api_key: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_KEY'
      ),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET'
      )
    });
  }

  async subirImagen(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'red-social/perfiles',
          resource_type: 'image'
        },
        (error, resultado) => {
          if (error) {
            return reject(error);
          }

          if (!resultado) {
            return reject(new Error('No se pudo subir la imagen'));
          }

          resolve(resultado.secure_url);
        }
      );

      stream.end(buffer);
    });
  }
}