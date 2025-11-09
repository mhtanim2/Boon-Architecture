import { FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import { partition } from 'lodash';
import * as mime from 'mime-types';

export type FileExtensionValidatorOptions = {
  fileExtensions: string[];
};

export class FileExtensionsValidator extends FileValidator<FileExtensionValidatorOptions, IFile> {
  private mimeTypes?: string[];

  buildErrorMessage(): string {
    return `Validation failed (expected type is one of [${this.validationOptions.fileExtensions.join(', ')}])`;
  }

  isValid(file?: IFile): boolean {
    if (!this.validationOptions) {
      return true;
    }
    this.mimeTypes ??= this.calculateMimeTypes();
    return !!file && 'mimetype' in file && !!this.mimeTypes.includes(file.mimetype);
  }

  private calculateMimeTypes() {
    const lookupType = (extension: string) => {
      const res = mime.lookup(extension);
      return res ? res : '';
    };

    const [valid, notValid] = partition(
      this.validationOptions.fileExtensions.map((extension) => ({
        extension: extension,
        mimeType: lookupType(extension),
      })),
      (x) => x.mimeType
    );

    if (notValid.length > 0) {
      throw new Error(
        `Unvalid file extensions in ${FileExtensionsValidator.name}: [${notValid.map((x) => x.extension).join(', ')}]`
      );
    }

    return valid.map((x) => x.mimeType);
  }
}
