import { dayjs } from '@boon/common/dayjs';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { tmpNameSync } from 'tmp';
import { copyFilesToFolderOrFail, deleteFiles, renameFiles, renameFilesOrFail } from './file-utils';

export class FileTransaction {
  public static readonly TO_ADD_SUFFIX = 'toAdd';
  public static readonly TO_DELETE_SUFFIX = 'toDelete';

  private readonly logger: Logger;

  private readonly transactionId: string;
  private readonly ts: Date;
  public readonly filesToAdd: string[];
  public readonly filesToDelete: string[];

  public constructor(logger?: Logger) {
    this.logger = logger ?? new Logger(FileTransaction.name);

    this.filesToAdd = [];
    this.filesToDelete = [];
    this.transactionId = tmpNameSync().split('-').pop() as string;
    this.ts = new Date();
  }

  async addFile(src: string, dest: string) {
    const destFolderName = path.dirname(dest);
    const destFileName = path.basename(dest);
    const destFileNameWithSuffix = `${destFileName}.${this.transactionId}.${FileTransaction.TO_ADD_SUFFIX}`;
    const destFilePathWithSuffix = path.join(destFolderName, destFileNameWithSuffix);

    this.logger.log(
      `Adding file '${destFilePathWithSuffix}' in fileTransaction '${this.transactionId}' (started at ${dayjs(
        this.ts
      ).format('YYYY-MM-DD HH:mm:ss')})`
    );
    this.filesToAdd.push(destFilePathWithSuffix);

    if (fs.existsSync(dest)) {
      await this.deleteFile(dest);
    }

    await copyFilesToFolderOrFail(this.logger, destFolderName, {
      srcpath: src,
      name: destFileNameWithSuffix,
    });
    await deleteFiles(this.logger, src);
  }

  async deleteFile(src: string) {
    const destFolderName = path.dirname(src);
    const destFileName = path.basename(src);
    const destFileNameWithSuffix = `${destFileName}.${this.transactionId}.${FileTransaction.TO_DELETE_SUFFIX}`;
    const destFilePathWithSuffix = path.join(destFolderName, destFileNameWithSuffix);

    this.logger.log(
      `Deleting file '${destFilePathWithSuffix}' in fileTransaction '${this.transactionId}' (started at ${dayjs(
        this.ts
      ).format('YYYY-MM-DD HH:mm:ss')})`
    );
    this.filesToDelete.push(destFilePathWithSuffix);
    await renameFilesOrFail(this.logger, { src, dest: destFilePathWithSuffix });
  }

  async commitTransaction() {
    this.logger.log(
      `Committing fileTransaction '${this.transactionId}' (started at ${dayjs(this.ts).format('YYYY-MM-DD HH:mm:ss')})`
    );
    await renameFiles(
      this.logger,
      ...this.filesToAdd.map((fileToAdd) => ({
        src: fileToAdd,
        dest: fileToAdd.replace(`.${this.transactionId}.${FileTransaction.TO_ADD_SUFFIX}`, ''),
      }))
    );
    await deleteFiles(this.logger, ...this.filesToDelete);
  }

  async rollbackTransaction() {
    this.logger.log(
      `Rollbacking fileTransaction '${this.transactionId}' (started at ${dayjs(this.ts).format('YYYY-MM-DD HH:mm:ss')})`
    );
    await deleteFiles(this.logger, ...this.filesToAdd);
    await renameFiles(
      this.logger,
      ...this.filesToDelete.map((fileToRestore) => ({
        src: fileToRestore,
        dest: fileToRestore.replace(`.${this.transactionId}.${FileTransaction.TO_DELETE_SUFFIX}`, ''),
      }))
    );
  }
}
