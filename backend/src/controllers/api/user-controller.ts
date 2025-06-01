import { InvalidBodyFormatError } from "@errors/controller-error";
import { authorize } from "@middlewares/authorize";
import { UserService } from "@services/api/user-service";
import { UserValueTransformer } from "@tranformers/user-value-transformers";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class UserController {
  public constructor(private readonly userService: UserService) {}

  private static readonly paramsSchema = z.object({
    username: z.string(),
  });

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const paramsSchema = UserController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    const response = await this.userService.get(params.username);
    res.status(StatusCodes.OK).json(response);
  }

  private static readonly patchSchema = z.object({
    username: z.string().transform(UserValueTransformer.username).optional(),
    name: z.string().transform(UserValueTransformer.name).optional(),
  });

  public async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userUid = authorize(req, res, next);
    if (userUid === undefined) {
      return;
    }

    const bodySchema = UserController.patchSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    await this.userService.patch(userUid, body);
    res.status(StatusCodes.CREATED).end();
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userUid = authorize(req, res, next);
    if (userUid === undefined) {
      return;
    }

    await this.userService.delete(userUid);
    res.status(StatusCodes.CREATED).end();
  }
}
