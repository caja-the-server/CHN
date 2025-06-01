import { config } from "@config";
import { ValueObjectVerifyResult } from "@value-objects/verify-result";

export namespace CategoryValue {
  const conf = config.category;

  export class Name {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Name> {
      const { success, message } = conf.nameConstraints.check(value);
      return success
        ? {
            success,
            data: new Name(value),
          }
        : { success, message };
    }
  }
}
