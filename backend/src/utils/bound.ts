import { PickProps } from "@util-types";

export function bound<Target, Prop extends PickProps<Target, Function>>(
  target: Target,
  prop: Prop
): Target[Prop] {
  return (target[prop] as Function).bind(target);
}
