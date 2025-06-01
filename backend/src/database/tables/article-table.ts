import { config } from "@config";
import { categoryTable } from "@database/tables/category-table";
import { userTable } from "@database/tables/user-table";
import { createdAt, updatedAt } from "@utils/timestamp-columns";
import {
  int,
  mysqlTable,
  smallint,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

const conf = config.article;

export const articleTable = mysqlTable("articles", {
  uid: smallint({ unsigned: true }).primaryKey().autoincrement(),
  uploaderUid: smallint({ unsigned: true }).references(() => userTable.uid, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  categoryName: varchar({
    length: config.category.nameConstraints.max,
  }).references(() => categoryTable.name, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  thumbnailName: varchar({
    length: conf.thumbnailNameConstraints.max,
  }).notNull(),
  thumbnailCaption: varchar({
    length: conf.thumbnailCaptionConstraints.max,
  }).notNull(),
  title: varchar({ length: conf.titleConstraints.max }).notNull(),
  subtitle: varchar({ length: conf.subtitleConstraints.max }).notNull(),
  content: text().notNull(),
  likeCount: int({ unsigned: true }).notNull().default(0),
  createdAt,
  updatedAt,
});
