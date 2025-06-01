import {
  ImageNotFoundError,
  UnsupportedImageFormatError,
} from "@errors/service-errors";
import fs from "fs/promises";
import path from "path";
import sharp, { FormatEnum, Metadata, Sharp } from "sharp";

sharp.cache(false);

export type ImageServiceOptions = {
  readonly uploadPath: string;
  readonly supportedFormats: (keyof FormatEnum)[];
  readonly imageProcessor: (
    sharp: Sharp,
    metadata: Metadata
  ) => Promise<{ name: string; data: Sharp }>;
};

export class ImageService {
  private readonly uploadPath: ImageServiceOptions["uploadPath"];
  private readonly supportedFormats: ImageServiceOptions["supportedFormats"];
  private readonly imageProcessor: ImageServiceOptions["imageProcessor"];

  public constructor(options: ImageServiceOptions) {
    this.uploadPath = options.uploadPath;
    this.supportedFormats = options.supportedFormats;
    this.imageProcessor = options.imageProcessor;
  }

  public async get(name: string): Promise<string> {
    try {
      const basename = path.basename(name); // 경로 조작 방지
      const imagePath = path.resolve(this.uploadPath, basename);
      const stat = await fs.stat(imagePath);
      if (!stat.isFile()) {
        return Promise.reject(new ImageNotFoundError());
      }
      return imagePath;
    } catch (error) {
      return Promise.reject(new ImageNotFoundError());
    }
  }

  public async post(imagePath: string): Promise<string> {
    const image = sharp(imagePath);
    try {
      const metadata = await image.metadata();
      const format = metadata.format;
      if (
        format === undefined ||
        !(this.supportedFormats as string[]).includes(format)
      ) {
        return Promise.reject(new UnsupportedImageFormatError());
      }
      const processor = this.imageProcessor;
      const { name, data: processed } = await processor(image, metadata);
      try {
        const dest = path.resolve(this.uploadPath, name);
        await processed.toFile(dest);
        return name;
      } finally {
        processed.destroy();
      }
    } finally {
      image.destroy();
    }
  }
}
