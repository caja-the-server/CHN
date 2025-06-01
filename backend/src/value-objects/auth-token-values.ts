import { config } from "@config";
import { ValueObjectVerifyResult } from "@value-objects/verify-result";

export namespace AuthTokenValue {
  const conf = config.authToken;

  export class Token {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Token> {
      const { success, message } = conf.tokenContraints.check(value);
      return success
        ? {
            success,
            data: new Token(value),
          }
        : { success, message };
    }
  }
}
