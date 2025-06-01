import { InvalidBodyFormatError } from "@errors/controller-error";
import { authorize } from "@middlewares/authorize";
import { CategoryService } from "@services/api/category-service";
import { CategoryValueTransformer } from "@tranformers/category-value-transformers";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  private static readonly paramsSchema = z.object({
    name: z.string(),
  });

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const response = await this.categoryService.getAll();
    res.status(StatusCodes.OK).json(response);
  }

  private static readonly postSchema = z.object({
    name: z.string().transform(CategoryValueTransformer.name),
  });

  public async post(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userUid = authorize(req, res, next);
    if (userUid === undefined) {
      return;
    }

    const bodySchema = CategoryController.postSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    await this.categoryService.post(userUid, body.name);
    res.status(StatusCodes.CREATED).end();
  }

  private static readonly patchSchema = z.object({
    name: z.string().transform(CategoryValueTransformer.name).optional(),
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

    const paramsSchema = CategoryController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    const bodySchema = CategoryController.patchSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    await this.categoryService.patch(userUid, params.name, body);
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

    const paramsSchema = CategoryController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    await this.categoryService.delete(userUid, params.name);
    res.status(StatusCodes.CREATED).end();
  }
}
