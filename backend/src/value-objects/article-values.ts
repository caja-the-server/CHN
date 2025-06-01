import { config } from "@config";
import { env } from "@env";
import { ValueObjectVerifyResult } from "@value-objects/verify-result";

import { z } from "zod";

export namespace ArticleValue {
  const conf = config.article;

  export class ThumbnailName {
    private constructor(public readonly value: string) {}

    public static verify(
      value: string
    ): ValueObjectVerifyResult<ThumbnailName> {
      const { success, message } = conf.thumbnailNameConstraints.check(value);
      return success
        ? {
            success,
            data: new ThumbnailName(value),
          }
        : { success, message };
    }
  }

  export class ThumbnailCaption {
    private constructor(public readonly value: string) {}

    public static verify(
      value: string
    ): ValueObjectVerifyResult<ThumbnailCaption> {
      const { success, message } =
        conf.thumbnailCaptionConstraints.check(value);
      return success
        ? {
            success,
            data: new ThumbnailCaption(value),
          }
        : { success, message };
    }
  }

  export class Title {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Title> {
      const { success, message } = conf.titleConstraints.check(value);
      return success
        ? {
            success,
            data: new Title(value),
          }
        : { success, message };
    }
  }

  export class Subtitle {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Subtitle> {
      const { success, message } = conf.subtitleConstraints.check(value);
      return success
        ? {
            success,
            data: new Subtitle(value),
          }
        : { success, message };
    }
  }

  export class Content {
    private static readonly schema = z.object({
      ops: z.array(
        z.object({
          attributes: z
            .object({
              font: z.enum(["serif", "monospace"]).optional(),
              size: z.enum(["small", "large", "huge"]).optional(),
              header: z.number().min(1).max(6).optional(),
              bold: z.literal(true).optional(),
              italic: z.literal(true).optional(),
              underline: z.literal(true).optional(),
              strike: z.literal(true).optional(),
              blockquote: z.literal(true).optional(),
              "code-block": z.enum(["plain"]).optional(),
              link: z.string().optional(),
              list: z
                .enum(["ordered", "bullet", "unchecked", "checked"])
                .optional(),
              script: z.enum(["sub", "super"]).optional(),
              indent: z.number().min(1).max(8).optional(),
              color: z.string().optional(),
              background: z.string().optional(),
              align: z.enum(["center", "right", "justify"]).optional(),
            })
            .optional(),
          insert: z.union([
            z.string(),
            z.object({
              image: z.string().refine((arg) => {
                try {
                  const url = new URL(arg);
                  if (url.origin !== env.SERVER_URL.origin) {
                    return false;
                  }
                  return true;
                } catch {
                  return false;
                }
              }),
            }),
            z.object({
              video: z.string(),
            }),
            z.object({
              formula: z.string(),
            }),
          ]),
        })
      ),
    });

    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Content> {
      const { success, message } = conf.contentDeltaConstraints.check(value);
      return success
        ? {
            success,
            data: new Content(value),
          }
        : { success, message };
    }
  }
}
