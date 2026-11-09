import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { MultipartFile } from '@fastify/multipart';
import { env } from '../config/env.js';

export class StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: MultipartFile): Promise<string> {
    const ext = path.extname(file.filename) || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const destination = path.join(this.uploadDir, filename);

    const buffer = await file.toBuffer();
    await fs.promises.writeFile(destination, buffer);

    return `/uploads/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
        return false;
      }
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();

