import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { Logger, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { Logger as PinoLogger } from 'nestjs-pino';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app/app.module';

import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { LocalConfig, localConfig } from './app/modules/local.config';

async function bootstrap() {
  initializeTransactionalContext();

  const appOpts: NestApplicationOptions = { rawBody: true, bufferLogs: true };
  const app = await NestFactory.create(AppModule, appOpts);
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.useLogger(app.get(PinoLogger));

  const config = app.get<LocalConfig>(localConfig.KEY);
  const port = config.port || 3000;

  patchNestjsSwagger();
  const swaggerOptions = new DocumentBuilder()
    .addServer(config.browserUrl + '/api')
    .addCookieAuth('Authentication')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    swaggerOptions: {
      tagsSorter: pinnedTagsSorter,
    },
  });

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  await app.listen(port);
  Logger.log(`🚀 Application is running on : http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

function pinnedTagsSorter(a: string, b: string) {
  const pinned = ['app', 'auth', 'tenants'];
  const indexOfA = pinned.indexOf(a);
  const indexOfB = pinned.indexOf(b);
  if (indexOfA >= 0 && indexOfB >= 0) return indexOfA < indexOfB ? -1 : 1;
  if (indexOfA >= 0) return -1;
  if (indexOfB >= 0) return 1;
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
