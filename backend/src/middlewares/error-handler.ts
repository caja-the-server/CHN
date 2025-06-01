import { InternalError } from "@errors/controller-error";
import { logger } from "@utils/logger";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof Error) {
    if (error.stack) {
      logger.error(error.stack);
    } else {
      logger.error(`${error.name} ${error.message}`);
    }
  } else {
    logger.error(error);
  }

  const internalError = new InternalError();
  internalError.response(res);
};
