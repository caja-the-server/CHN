import { ClassToObject } from "@util-types";

export type PublicUserDTOProps = ClassToObject<PublicUserDTO>;

export class PublicUserDTO {
  public readonly username: string;
  public readonly name: string;

  public constructor(props: PublicUserDTOProps) {
    this.username = props.username;
    this.name = props.name;
  }
}
