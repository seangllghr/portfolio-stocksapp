/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as config from './assets/config.json';

async function bootstrap() {
  const logLevels: LogLevel[] = ['log', 'warn', 'error'];
  if (config.debug) logLevels.push('debug');
  const app = await NestFactory.create(AppModule, {
    logger: logLevels
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }))
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
