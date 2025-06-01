export type ClassToObject<Class> = { [P in keyof Class]: Class[P] };

export type PickProps<TargetObject, TargetType> =
  keyof TargetObject extends infer K
    ? K extends keyof TargetObject
      ? TargetObject[K] extends TargetType
        ? K
        : never
      : never
    : never;
