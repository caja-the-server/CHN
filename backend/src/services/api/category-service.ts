import { Database } from "@database/database";
import { categoryTable } from "@database/tables/category-table";
import { userTable } from "@database/tables/user-table";
import { CategoryDTO } from "@dto/category-dto";
import {
  CategoryNotFoundError,
  PermissionDeniedError,
  UserNotFoundError,
} from "@errors/service-errors";
import { dateStringToISO } from "@utils/date-string-to-iso";
import { CategoryValue } from "@value-objects/category-values";
import { asc, eq } from "drizzle-orm";

export class CategoryService {
  public constructor(private readonly database: Database) {}

  public async getAll(): Promise<CategoryDTO[]> {
    const categories = await this.database
      .select({
        name: categoryTable.name,
        createdAt: categoryTable.createdAt,
        updatedAt: categoryTable.updatedAt,
      })
      .from(categoryTable)
      .orderBy(asc(categoryTable.name))
      .execute();

    return categories.map(
      (category) =>
        new CategoryDTO({
          ...category,
          createdAt: dateStringToISO(category.createdAt),
          updatedAt: dateStringToISO(category.updatedAt),
        })
    );
  }

  public async post(userUid: number, name: CategoryValue.Name): Promise<void> {
    const user = (
      await this.database
        .select({
          isAdmin: userTable.isAdmin,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    if (!user.isAdmin) {
      return Promise.reject(new PermissionDeniedError());
    }

    await this.database
      .insert(categoryTable)
      .values({ name: name.value })
      .execute();
  }

  public async patch(
    userUid: number,
    categoryName: string,
    data: { name?: CategoryValue.Name }
  ): Promise<void> {
    const user = (
      await this.database
        .select({
          isAdmin: userTable.isAdmin,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    if (!user.isAdmin) {
      return Promise.reject(new PermissionDeniedError());
    }

    const [header] = await this.database
      .update(categoryTable)
      .set({ name: data.name?.value })
      .where(eq(categoryTable.name, categoryName))
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new CategoryNotFoundError());
    }
  }

  public async delete(userUid: number, categoryName: string): Promise<void> {
    const user = (
      await this.database
        .select({
          isAdmin: userTable.isAdmin,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    if (!user.isAdmin) {
      return Promise.reject(new PermissionDeniedError());
    }

    const [header] = await this.database
      .delete(categoryTable)
      .where(eq(categoryTable.name, categoryName))
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new CategoryNotFoundError());
    }
  }
}
