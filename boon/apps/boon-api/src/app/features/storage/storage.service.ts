import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as mime from 'mime-types';
import * as path from 'path';
import { Readable } from 'typeorm/platform/PlatformTools';
import { LocalConfig, localConfig } from '../../modules/local.config';

export interface AssetResponse {
  body: Readable | ReadableStream<any> | Blob | Buffer;
}
export type RendererResponse = { headers?: Record<string, string> } & (
  | ({ isOk: true } & Partial<AssetResponse>)
  | { isOk: false; error: Error }
);

@Injectable()
export class StorageService {
  private readonly storageBasePath: string;

  constructor(@Inject(localConfig.KEY) localConfig: LocalConfig) {
    this.storageBasePath = localConfig.fileUploadDestDirectory;
  }

  async getFileByUrl(
    url: string,
    headers: Record<string, string>
    /* options: Partial<{ download: boolean }>*/
  ): Promise<RendererResponse> {
    function normalizeContentType(contentType: string | undefined): string | undefined {
      if (contentType?.includes('text/html')) {
        return 'text/plain';
      }
      return contentType;
    }

    try {
      const file = path.resolve(path.join(this.storageBasePath, url));
      const data = await fs.stat(file);
      const contentType = mime.lookup(file);
      const body = fs.createReadStream(file);

      const headers: Record<string, string> = {};
      headers['Accept-Ranges'] = 'bytes';
      headers['Content-Type'] = contentType ? normalizeContentType(contentType) ?? '' : '';
      headers['Content-Length'] = data.size.toString();
      headers['Cross-Origin-Resource-Policy'] = 'cross-origin';

      // if (options.expires) {
      //   headers['Expires'] = options.expires;
      // } else {
      //   headers['Cache-Control'] = data.metadata.cacheControl;
      // }

      // if (data.metadata.contentRange) {
      //   headers['Content-Range'] = data.metadata.contentRange;
      // }

      // if (typeof options.download !== 'undefined') {
      //   if (options.download === '') {
      //     headers['Content-Disposition'] = 'attachment;';
      //   } else {
      //     const encodedFileName = encodeURIComponent(options.download);

      //     headers[
      //       'Content-Disposition'
      //     ] = `attachment; filename=${encodedFileName}; filename*=UTF-8''${encodedFileName};`;
      //   }
      // }

      return {
        headers,
        isOk: true,
        body,
      };
    } catch (err) {
      return {
        isOk: false,
        error: err as Error,
      };
    }
  }
}
