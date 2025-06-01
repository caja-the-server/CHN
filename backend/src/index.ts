import { config } from "@config";
import { logger } from "@utils/logger";
import { NODE_ENV } from "@utils/node-env";
import fs from "fs/promises";
import http from "http";
import { exit } from "process";

try {
  const { env } = await import("@env");
  logger.info(`Current NODE_ENV = ${NODE_ENV}`);

  logger.info("Checking directories...");
  const requiredPaths = [
    config.image.tempPath,
    config.image.uploadPath,
    config.thumbnail.tempPath,
    config.thumbnail.uploadPath,
  ];
  for (const requiredPath of requiredPaths) {
    await fs.mkdir(requiredPath, { recursive: true });
  }
  logger.info("Completed checking directories");

  logger.info("Connecting database...");
  await import("@database/database");
  logger.info("Completed connecting database");

  logger.info("Starting express server...");
  const port = env.SERVER_PORT;
  const { express } = await import("@express");
  const server = http.createServer(express);
  await new Promise<void>((resolve) => {
    server.listen(port, () => {
      return resolve();
    });
  });
  logger.info(
    `Completed starting express server (origin: \`${env.SERVER_URL.origin}\`, port: ${port})`
  );
} catch (error) {
  logger.error(error);
  exit(1);
}
