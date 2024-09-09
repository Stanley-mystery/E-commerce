import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import FileType from 'file-type';
import * as path from 'path';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

export const isFileExtensionSafe = async (
  fullFilePath: string,
): Promise<boolean> => {
  try {
    const fileExtensionAndMimeType = await FileType.fromFile(fullFilePath);

    if (
      !fileExtensionAndMimeType ||
      !fileExtensionAndMimeType.ext ||
      !fileExtensionAndMimeType.mime
    ) {
      return false;
    }

    const isFileTypeLegit = validFileExtensions.includes(
      fileExtensionAndMimeType.ext as validFileExtension,
    );
    const isMimeTypeLegit = validMimeTypes.includes(
      fileExtensionAndMimeType.mime as validMimeType,
    );

    return isFileTypeLegit && isMimeTypeLegit;
  } catch (error) {
    console.error('Error checking file extension:', error);
    return false;
  }
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error('Error removing file:', err);
  }
};
