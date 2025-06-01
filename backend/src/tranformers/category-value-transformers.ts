import { CategoryValue } from "@value-objects/category-values";
import { z } from "zod";

export namespace CategoryValueTransformer {
  export const name = (
    arg: string,
    ctx: z.RefinementCtx
  ): CategoryValue.Name => {
    const verifyResult = CategoryValue.Name.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };
}
