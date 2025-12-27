import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from 'graphql-upload';
import * as express from 'express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({ origin: true, credentials: true });

  const maxFileSize = configService.get<number>('upload.maxFileSize');
  const maxFiles = configService.get<number>('upload.maxFiles');
  app.use(graphqlUploadExpress({ maxFileSize, maxFiles }));
  app.use('/uploads', express.static(join(process.cwd(), 'public/uploads')));

  const port = configService.get<number>('app.port');
  await app.listen(port);
}
bootstrap();

