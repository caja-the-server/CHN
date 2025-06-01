import {
  FileTooLargeError,
  UnsupportedFileError,
} from "@errors/controller-error";
import { authorize } from "@middlewares/authorize";
import { ImageService } from "@services/cdn/image-service";
import { logger } from "@utils/logger";
import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import micromatch from "micromatch";
import multer, { Multer, MulterError } from "multer";
import path from "path";
import { z } from "zod";

export type ImageControllerOptions = {
  readonly tempPath: string;
  readonly maxBytes: number;
  readonly supportedMIMETypes: string[];
  readonly baseUrl: URL;
};

export class ImageController {
  private readonly maxBytes: ImageControllerOptions["maxBytes"];
  private readonly baseUrl: ImageControllerOptions["baseUrl"];
  private readonly upload: ReturnType<Multer["single"]>;

  public constructor(
    private readonly service: ImageService,
    options: ImageControllerOptions
  ) {
    this.maxBytes = options.maxBytes;
    this.baseUrl = options.baseUrl;
    this.upload = multer({
      dest: path.resolve(options.tempPath),
      limits: { fileSize: this.maxBytes },
      fileFilter(req, file, callback) {
        if (micromatch.isMatch(file.mimetype, options.supportedMIMETypes)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    }).single("image");
  }

  private static readonly paramsSchema = z.object({
    name: z.string(),
  });

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const paramsSchema = ImageController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    const filePath = await this.service.get(params.name);
    res.status(StatusCodes.OK).sendFile(filePath);
  }

  public async post(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userUid = authorize(req, res, next);
    if (userUid === undefined) {
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        this.upload(req, res, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      });
    } catch (error) {
      if (!(error instanceof MulterError)) {
        return Promise.reject(error);
      }
      if (error.code === "LIMIT_FILE_SIZE") {
        next(
          new FileTooLargeError(
            `File cannot bigger than ${this.maxBytes} bytes`
          )
        );
        return;
      }
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        next(new UnsupportedFileError());
        return;
      }
      return Promise.reject(error);
    }

    const file = req.file;

    if (file === undefined) {
      next(new UnsupportedFileError());
      return;
    }

    const imagePath = path.resolve(file.destination, file.filename);
    try {
      const name = await this.service.post(imagePath);
      const url = new URL(name, this.baseUrl);
      res.status(StatusCodes.CREATED).json({ url: url.href, name });
    } finally {
      try {
        await fs.rm(imagePath, {
          retryDelay: 300,
          maxRetries: 3,
        });
      } catch (error) {
        logger.warn(`Temp file deletion failed: ${imagePath}`);
      }
    }
  }
}
