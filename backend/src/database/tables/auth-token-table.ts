import { config } from "@config";
import { createdAt } from "@utils/timestamp-columns";
import { boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const conf = config.authToken;

export const authTokenTable = mysqlTable("auth_tokens", {
  token: varchar({ length: conf.tokenContraints.max }).primaryKey(),
  isAdminToken: boolean().notNull().default(false),
  createdAt,
});
