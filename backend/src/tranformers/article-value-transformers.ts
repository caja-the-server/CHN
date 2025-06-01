import { ArticleValue } from "@value-objects/article-values";
import { z } from "zod";

export namespace ArticleValueTransformer {
  export const thumbnailName = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.ThumbnailName => {
    const verifyResult = ArticleValue.ThumbnailName.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };

  export const thumbnailCaption = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.ThumbnailCaption => {
    const verifyResult = ArticleValue.ThumbnailCaption.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };

  export const title = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.Title => {
    const verifyResult = ArticleValue.Title.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };

  export const subtitle = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.Subtitle => {
    const verifyResult = ArticleValue.Subtitle.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };

  export const content = (
    arg: string,
    ctx: z.RefinementCtx
  ): ArticleValue.Content => {
    const verifyResult = ArticleValue.Content.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };
}
