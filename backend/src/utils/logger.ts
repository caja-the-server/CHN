import path from "path";
import { createLogger, format, transports } from "winston";
import WinstonDailyRotateFile from "winston-daily-rotate-file";

const logPath = path.resolve("./logs/");
const errorLogPath = path.resolve("./logs/error/");

export const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) => `[${timestamp}]-[${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      level: "silly",
      format: format.colorize({ all: true }),
    }),
    new WinstonDailyRotateFile({
      level: "silly",
      datePattern: "YYYY-MM-DD",
      dirname: logPath,
      filename: "%DATE%.log",
      maxFiles: 365,
      zippedArchive: true,
    }),
    new WinstonDailyRotateFile({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: errorLogPath,
      filename: "%DATE%.error.log",
      maxFiles: 365,
      zippedArchive: true,
    }),
  ],
});
