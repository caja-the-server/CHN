import { UnauthorizedRequestError } from "@errors/controller-error";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const authorize: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): number | undefined => {
  const userUid = req.session.userUid;
  if (userUid === undefined) {
    next(new UnauthorizedRequestError());
    return;
  }
  return userUid;
};
