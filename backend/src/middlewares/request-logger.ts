import { logger } from "@utils/logger";
import { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, res, next): void => {
  const startTime = Date.now();
  res.on("finish", () => {
    const httpVersion = `HTTP/${req.httpVersion}`;
    const method = req.method;
    const url = req.originalUrl;
    const statusCode = res.statusCode;
    const duration = Date.now() - startTime;
    const contentSize = String(res.getHeader("content-length") ?? 0);
    const ip = req.ip ?? "Unknown Ip";
    const userAgent = req.headers["user-agent"];

    logger.http(
      `[${httpVersion}] ${method} ${url} ${statusCode} in ${duration}ms with ${contentSize}bytes to ${ip} ${userAgent}`
    );
  });
  next();
};
