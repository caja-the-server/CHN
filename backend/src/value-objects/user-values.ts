import { config } from "@config";
import { ValueObjectVerifyResult } from "@value-objects/verify-result";

export namespace UserValue {
  const conf = config.user;

  export class Username {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Username> {
      const { success, message } = conf.usernameConstraints.check(value);
      return success
        ? {
            success,
            data: new Username(value),
          }
        : { success, message };
    }
  }

  export class Password {
    private constructor(public readonly value: string) {}

    public static verify(value: string): ValueObjectVerifyResult<Password> {
      const { success, message } = conf.passwordConstraints.check(value);
      return success
        ? {
            success,
            data: new Password(value),
          }
        : { success, message };
    }
  }

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
