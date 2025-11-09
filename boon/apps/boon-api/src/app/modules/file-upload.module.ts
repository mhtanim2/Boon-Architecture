import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { LocalConfig, localConfig } from './local.config';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (localConfig: LocalConfig) => {
        return { dest: localConfig.fileUploadTempDirectory };
      },
      inject: [localConfig.KEY],
    }),
  ],
  exports: [MulterModule],
})
export class FileUploadMulterModule {}
