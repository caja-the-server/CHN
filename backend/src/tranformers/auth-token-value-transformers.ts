import { AuthTokenValue } from "@value-objects/auth-token-values";
import { z } from "zod";

export namespace AuthTokenValueTransformer {
  export const token = (
    arg: string,
    ctx: z.RefinementCtx
  ): AuthTokenValue.Token => {
    const verifyResult = AuthTokenValue.Token.verify(arg);
    if (!verifyResult.success) {
      ctx.addIssue({ code: "custom", message: verifyResult.message });
      return z.NEVER;
    }
    return verifyResult.data;
  };
}
