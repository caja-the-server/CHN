import { UserValue } from "@value-objects/user-values";
import { z } from "zod";

export namespace UserValueTransformer {
  export const username = (
    arg: string,
    ctx: z.RefinementCtx
  ): UserValue.Username => {
    const verifyResult = UserValue.Username.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };

  export const password = (
    arg: string,
    ctx: z.RefinementCtx
  ): UserValue.Password => {
    const verifyResult = UserValue.Password.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };

  export const name = (arg: string, ctx: z.RefinementCtx): UserValue.Name => {
    const verifyResult = UserValue.Name.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };
}
