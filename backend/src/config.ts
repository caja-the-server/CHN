import { InvalidImageSizeError } from "@errors/service-errors";
import { ImageServiceOptions } from "@services/cdn/image-service";
import { BCRYPT_MAX_BYTE_LENGTH } from "@utils/bcrypt-constants";
import { StringConstraint, stringConstraints } from "@utils/constraint";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export type Config = {
  readonly authToken: {
    readonly tokenContraints: StringConstraint;
  };

  readonly user: {
    readonly usernameConstraints: StringConstraint;
    readonly passwordConstraints: StringConstraint;
    readonly nameConstraints: StringConstraint;
    readonly passwordHashRounds: number;
  };

  readonly category: {
    readonly nameConstraints: StringConstraint;
  };

  readonly article: {
    readonly defaultQueryLimit: number;
    readonly maxQueryLimit: number;
    readonly thumbnailNameConstraints: StringConstraint;
    readonly thumbnailCaptionConstraints: StringConstraint;
    readonly titleConstraints: StringConstraint;
    readonly subtitleConstraints: StringConstraint;
    readonly contentDeltaConstraints: StringConstraint;
  };

  readonly thumbnail: {
    readonly tempPath: string;
    readonly defaultName: string;
    readonly maxBytes: number;
    readonly rateLimit: number;
    readonly rateWindow: number;
  } & ImageServiceOptions;

  readonly image: {
    readonly tempPath: string;
    readonly maxBytes: number;
    readonly rateLimit: number;
    readonly rateWindow: number;
  } & ImageServiceOptions;
};

export const config = {
  authToken: {
    tokenContraints: stringConstraints([
      {
        min: 1,
        message: "Token cannot be empty",
      },
      {
        max: 128,
        message: "Token cannot be greater than 128 characters",
      },
    ]),
  },

  user: {
    usernameConstraints: stringConstraints([
      {
        min: 1,
        message: "Username cannot be empty",
      },
      {
        max: 32,
        message: "Username cannot be greater than 32 characters",
      },
      {
        pattern: /^[a-z\d]*$/,
        message: "Username can only contain letters and numbers",
      },
    ]),
    passwordConstraints: stringConstraints([
      {
        min: 8,
        message: "Password cannot be shorter than 8 characters",
      },
      {
        max: 72,
        message: "Password cannot be greater than 72 characters",
      },
      {
        pattern: /^[!`#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_`a-z{|}~]*$/,
        message:
          "Password can only contain letters, numbers, and common punctuation characters",
      },
      {
        // important
        validator: (value) =>
          Buffer.byteLength(value) <= BCRYPT_MAX_BYTE_LENGTH,
        message: `Password cannot be greater than ${BCRYPT_MAX_BYTE_LENGTH} bytes`,
      },
    ]),
    nameConstraints: stringConstraints([
      {
        min: 1,
        message: "Name cannot be empty",
      },
      {
        max: 16,
        message: "Name cannot be greater than 16 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Name cannot contain line breaks",
      },
    ]),
    passwordHashRounds: 10,
  },

  category: {
    nameConstraints: stringConstraints([
      {
        min: 1,
        message: "Category name be empty",
      },
      {
        max: 16,
        message: "Category name be greater than 16 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Category name cannot contain line breaks",
      },
    ]),
  },

  article: {
    defaultQueryLimit: 30,
    maxQueryLimit: 30,
    thumbnailNameConstraints: stringConstraints([
      {
        max: 255,
        message: "Thumbnail name cannot be greater than 255 characters",
      },
      {
        validator: (value) => {
          const basename = path.basename(value);
          if (basename !== value) {
            return false;
          }
          return true;
        },
        message: "Thumbnail name is not valid",
      },
    ]),
    thumbnailCaptionConstraints: stringConstraints([
      {
        max: 256,
        message: "Thumbnail caption cannot be greater than 64 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Thumbnail caption cannot contain line breaks",
      },
    ]),
    titleConstraints: stringConstraints([
      {
        min: 1,
        message: "Title cannot be empty",
      },
      {
        max: 256,
        message: "Title cannot be greater than 64 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Title cannot contain line breaks",
      },
    ]),
    subtitleConstraints: stringConstraints([
      {
        max: 512,
        message: "Subtitle cannot be greater than 128 characters",
      },
      {
        validator: (value) => !value.includes("\n"),
        message: "Subtitle cannot contain line breaks",
      },
    ]),
    contentDeltaConstraints: stringConstraints([
      {
        max: 65535,
        message: "Content is too long",
      },
    ]),
  },

  thumbnail: {
    tempPath: path.resolve("./uploads/tmp"),
    uploadPath: path.resolve("./uploads/thumbnails"),
    defaultName: "default.webp",
    maxBytes: 4 * 1024 * 1024 /* =4MB */,
    rateLimit: 10,
    rateWindow: 60 * 1000 /* =1min */,
    supportedFormats: ["webp"],
    async imageProcessor(sharp, metadata) {
      const width = 1280;
      const height = 720;

      if (metadata.width !== width || metadata.height !== height) {
        return Promise.reject(new InvalidImageSizeError());
      }

      const name = `${uuidv4()}.webp`;
      const data = sharp.webp({
        lossless: true,
        force: true,
      });
      return { name, data };
    },
  },

  image: {
    tempPath: path.resolve("./uploads/tmp"),
    uploadPath: path.resolve("./uploads/images"),
    maxBytes: 4 * 1024 * 1024 /* =4MB */,
    rateLimit: 10,
    rateWindow: 60 * 1000 /* =1min */,
    supportedFormats: ["webp"],
    async imageProcessor(sharp) {
      const name = `${uuidv4()}.webp`;
      const data = sharp.webp({
        lossless: true,
        force: true,
      });
      return { name, data };
    },
  },
} as const satisfies Config;
