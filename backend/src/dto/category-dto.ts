import { ClassToObject } from "@util-types";

export type CategoryDTOProps = ClassToObject<CategoryDTO>;

export class CategoryDTO {
  public readonly name: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  public constructor(props: CategoryDTOProps) {
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
