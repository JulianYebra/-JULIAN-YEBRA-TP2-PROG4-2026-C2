import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const origenesPermitidos = [
  'http://localhost:4200',
  process.env.FRONTEND_URL
  ].filter((origen): origen is string => Boolean(origen));

  app.enableCors({
    origin: origenesPermitidos
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/'
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();