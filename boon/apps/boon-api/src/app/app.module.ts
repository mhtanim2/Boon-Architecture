import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, NestApplication, RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from 'nestjs-pino';
import { UrlGeneratorModule } from 'nestjs-url-generator';

import { ZodSerializerInterceptor } from '../zod/serializer';
import { AllExceptionsFilter } from './../filters';
import { AppController } from './app.controller';

import { appRoutes } from './app.routes';
import { AppService } from './app.service';

import { AdminModule } from './features/admin/admin.module';
import { ArticoliModule } from './features/articoli/articoli.module';
import { AuthModule } from './features/auth/auth.module';
import { FileUploadsModule } from './features/file-uploads/file-uploads.module';
import { LivelliPrivilegioModule } from './features/livelli-privilegio/livelli-privilegio.module';
import { MailerModule } from './features/mailer/mailer.module';
import { ParametersModule } from './features/parameters/parameters.module';
import { RevisioniModule } from './features/revisioni/revisioni.module';
import { RuoliModule } from './features/ruoli/ruoli.module';
import { StorageModule } from './features/storage/storage.module';
import { TemplateModule } from './features/template/template.module';
import { TenantFromParamsInterceptor } from './features/tenants/tenant-from-params.interceptor';
import { TenantsModule } from './features/tenants/tenants.module';
import { UsersModule } from './features/users/users.module';
import { databaseConfig } from './modules/database.config';
import { DatabaseModule } from './modules/database.module';
import { FileUploadMulterModule } from './modules/file-upload.module';
import { LocalConfig, localConfig } from './modules/local.config';
import { StagioniModule } from './features/stagioni/stagioni.module';
import { StagioniClientiModule } from './features/stagioni-clienti/stagioni-clienti.module';
import { GeneriModule } from './features/generi/generi.module';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: (localConfig: LocalConfig) => ({
        pinoHttp: {
          quietReqLogger: true,
          mixin() {
            return { context: NestApplication.name };
          },
          name: 'boon-api',
          transport: {
            targets: [
              ...(process.env['NODE_ENV'] !== 'production'
                ? [
                    {
                      target: 'pino-pretty',
                      level: process.env['NODE_ENV'] !== 'production' ? 'debug' : 'info',
                      options: {
                        singleLine: true,
                        colorize: true,
                        messageFormat: '[{context}] {msg}',
                        ignore: 'context',
                      },
                    },
                  ]
                : []),
              {
                target: '@autotelic/pino-seq-transport',
                level: 'debug',
                options: {
                  loggerOpts: {
                    serverUrl: `${localConfig.seqServerHost}:${localConfig.seqServerPort}`,
                    apiKey: localConfig.seqApiKey,
                  },
                },
              },
            ],
          },
        },
      }),
      inject: [localConfig.KEY],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [localConfig, databaseConfig],
    }),
    UrlGeneratorModule.forRootAsync({
      useFactory: (localConfig: LocalConfig) => ({
        appUrl: `${localConfig.browserUrl}/api`,
      }),
      inject: [localConfig.KEY],
    }),
    RouterModule.register(appRoutes),
    FileUploadMulterModule,
    PassportModule,
    DatabaseModule,
    AdminModule,
    TenantsModule,
    AuthModule,
    UsersModule,
    MailerModule,
    ParametersModule,
    FileUploadsModule,
    ArticoliModule,
    GeneriModule,
    RevisioniModule,
    StagioniModule,
    StagioniClientiModule,
    TemplateModule,
    RuoliModule,
    LivelliPrivilegioModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TenantFromParamsInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
