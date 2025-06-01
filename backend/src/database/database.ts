import { env } from "@env";
import { drizzle } from "drizzle-orm/mysql2";

export const database = drizzle({
  connection: {
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    database: env.DATABASE_NAME,
    connectionLimit: env.DATABASE_CONNECTION_LIMIT,
  },
  casing: "snake_case",
});

export type Database = typeof database;
