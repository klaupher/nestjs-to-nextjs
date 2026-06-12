import { BadRequestException, Injectable } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { generateRandomSuffix } from '../common/utils/generate-random-suffix';

@Injectable()
export class UploadService {
  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const maxFileSize = 900 * 1024; // equivale a 900k
    if (file.size > maxFileSize) {
      throw new BadRequestException('Arquivo muito grande');
    }

    const fileType = await fileTypeFromBuffer(file.buffer);
    if (
      !fileType ||
      !['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(
        fileType.mime,
      )
    ) {
      throw new BadRequestException('Arquivo inválido ou tipo não permitido');
    }

    // 2026-04-29T1523
    const today = new Date().toISOString().split('T')[0];
    const uploadPath = resolve(__dirname, '..', '..', 'uploads', today); // gera pastas diárias
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${generateRandomSuffix().toUpperCase()}`;
    const fileExtension = fileType.ext;
    const fileName = `${uniqueSuffix}.${fileExtension}`;
    const fileFullPath = resolve(uploadPath, fileName);

    //Salva o buffer no disco
    writeFileSync(fileFullPath, file.buffer);

    return {
      url: `/uploads/${today}/${fileName}`,
    };
  }
}
