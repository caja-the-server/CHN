import { ResponsibleError } from "@errors/responsible-error";
import { ErrorRequestHandler } from "express";

export const responsibleErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  if (error instanceof ResponsibleError) {
    error.response(res);
    return;
  }
  next(error);
};
