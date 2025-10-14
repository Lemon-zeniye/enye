import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function UploadImagesInterceptor(
  fieldName = 'images',
  maxCount = 5,
  destination = './uploads/products',
) {
  return UseInterceptors(
    FilesInterceptor(fieldName, maxCount, {
      storage: diskStorage({
        destination,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `variant-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  );
}
