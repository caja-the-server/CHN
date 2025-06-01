import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";

const currentTimestamp = sql`CURRENT_TIMESTAMP`;

export const createdAt = timestamp({
  mode: "string",
})
  .notNull()
  .default(currentTimestamp);

export const updatedAt = timestamp({
  mode: "string",
})
  .notNull()
  .default(currentTimestamp)
  .$onUpdate(() => currentTimestamp);
