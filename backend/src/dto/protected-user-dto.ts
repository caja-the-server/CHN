import { PublicUserDTO } from "@dto/public-user-dto";
import { ClassToObject } from "@util-types";

export type ProtectedUserDTOProps = ClassToObject<ProtectedUserDTO>;

export class ProtectedUserDTO extends PublicUserDTO {
  public readonly isAdmin: boolean;
  public readonly createdAt: string;

  public constructor(props: ProtectedUserDTOProps) {
    super(props);
    this.createdAt = props.createdAt;
    this.isAdmin = props.isAdmin;
  }
}
