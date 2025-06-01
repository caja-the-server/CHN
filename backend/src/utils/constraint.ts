export type StringMinConstraint = { min: number; message: string };
export type StringMaxConstraint = { max: number; message: string };
export type StringPatternConstraint = { pattern: RegExp; message: string };
export type StringCustomConstraint = {
  validator: (value: string) => boolean;
  message: string;
};

export type StringConstraints =
  | StringMinConstraint
  | StringMaxConstraint
  | StringPatternConstraint
  | StringCustomConstraint;

export interface StringConstraint {
  check(
    value: string
  ):
    | { success: true; message?: undefined }
    | { success: false; message: string };
}

export function stringConstraints<C extends StringConstraints>(
  constraints: C[]
): StringConstraint &
  (StringMinConstraint extends C ? { min: number } : unknown) &
  (StringMaxConstraint extends C ? { max: number } : unknown) {
  const constraintObject: StringConstraint & { min?: number; max?: number } = {
    check(value) {
      for (const constraint of constraints) {
        switch (true) {
          case "min" in constraint:
            if (value.length < constraint.min) {
              return { success: false, message: constraint.message };
            }
            break;
          case "max" in constraint:
            if (value.length > constraint.max) {
              return { success: false, message: constraint.message };
            }
            break;
          case "pattern" in constraint:
            if (!constraint.pattern.test(value)) {
              return { success: false, message: constraint.message };
            }
            break;
          case "validator" in constraint:
            if (!constraint.validator(value)) {
              return { success: false, message: constraint.message };
            }
            break;
        }
      }
      return { success: true };
    },
  };

  for (const constraint of constraints) {
    if ("min" in constraint) {
      if (
        constraintObject.min === undefined ||
        constraintObject.min > constraint.min
      ) {
        constraintObject.min = constraint.min;
      }
    } else if ("max" in constraint) {
      if (
        constraintObject.max === undefined ||
        constraintObject.max < constraint.max
      ) {
        constraintObject.max = constraint.max;
      }
    }
  }

  return constraintObject as any;
}
