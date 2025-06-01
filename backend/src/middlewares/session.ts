import { env } from "@env";
import MySQLStore from "express-mysql-session";
import Session from "express-session";

declare module "express-session" {
  interface SessionData {
    userUid: number;
  }
}

export const session = Session({
  secret: env.SERVER_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 1000 /* almost 1 month */,
  },
  store: new (MySQLStore(await import("express-session")))({
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    database: env.DATABASE_NAME,
    clearExpired: true,
    checkExpirationInterval: 3 * 60 * 1000 /* 3 mins */,
    expiration: 30 * 24 * 60 * 1000 /* almost 1 month */,
  }),
});
