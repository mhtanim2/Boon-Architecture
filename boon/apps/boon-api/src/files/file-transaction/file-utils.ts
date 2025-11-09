import { Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

interface File {
  srcpath: string;
  name: string;
}

export const copyFilesToFolder = (logger: Logger, destFolder: string, ...files: File[]) =>
  _copyFilesToFolder(logger, destFolder, false, ...files);
export const copyFilesToFolderOrFail = (logger: Logger, destFolder: string, ...files: File[]) =>
  _copyFilesToFolder(logger, destFolder, true, ...files);
export const deleteFolder = (logger: Logger, folder: string) => _deleteFolder(logger, false, folder);
export const deleteFolderOrFail = (logger: Logger, folder: string) => _deleteFolder(logger, true, folder);
export const deleteFiles = (logger: Logger, ...files: string[]) => _deleteFiles(logger, false, ...files);
export const deleteFilesOrFail = (logger: Logger, ...files: string[]) => _deleteFiles(logger, true, ...files);
export const renameFiles = (logger: Logger, ...files: Array<{ src: string; dest: string }>) =>
  _renameFiles(logger, false, ...files);
export const renameFilesOrFail = (logger: Logger, ...files: Array<{ src: string; dest: string }>) =>
  _renameFiles(logger, true, ...files);

export const normalizeWin32PathToPosix = (filepath: string): string =>
  path.win32.normalize(filepath).split(path.win32.sep).join(path.posix.sep);

const _copyFilesToFolder = async (
  logger: Logger,
  destFolder: string,
  throwsOnError = false,
  ...files: File[]
): Promise<void> => {
  await fs.mkdir(destFolder, { recursive: true });

  for (const file of files) {
    try {
      const destpath = path.join(destFolder, file.name);
      await fs.copyFile(file.srcpath, destpath);
      logger.debug(`Copying file '${file.srcpath}' to '${destpath}'`);
    } catch (err: any) {
      const msg = `Could not copy '${file.srcpath}' to '${destFolder}'. Inner exception: ${err.message}`;
      if (throwsOnError) {
        logger.error(msg);
        err.message = msg;
        throw err;
      }
      logger.warn(msg);
    }
  }
};

const _deleteFolder = async (logger: Logger, throwsOnError = false, folder: string): Promise<void> => {
  try {
    await fs.rmdir(folder, { recursive: true });
    logger.debug(`Deleting folder '${folder}'`);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return;
    }
    const msg = `Could not delete '${folder}'. Inner exception: ${err.message}`;
    if (throwsOnError) {
      logger.error(msg);
      throw err;
    }
    logger.warn(msg);
  }
};

const _deleteFiles = async (logger: Logger, throwsOnError = false, ...files: string[]): Promise<void> => {
  for (const file of files) {
    try {
      await fs.unlink(file);
      logger.debug(`Deleting file '${file}'`);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return;
      }
      const msg = `Could not delete '${file}'. Inner exception: ${err.message}`;
      if (throwsOnError) {
        logger.error(msg);
        throw err;
      }
      logger.warn(msg);
    }
  }
};

const _renameFiles = async (
  logger: Logger,
  throwsOnError = false,
  ...files: Array<{ src: string; dest: string }>
): Promise<void> => {
  for (const file of files) {
    try {
      await fs.rename(file.src, file.dest);
      logger.debug(`Renaming file '${file.src}' to '${file.dest}'`);
    } catch (err: any) {
      const msg = `Could not rename '${file.src}' to '${file.dest}'. Inner exception: ${err.message}`;
      if (throwsOnError) {
        logger.error(msg);
        err.message = msg;
        throw err;
      }
      logger.warn(msg);
    }
  }
};
