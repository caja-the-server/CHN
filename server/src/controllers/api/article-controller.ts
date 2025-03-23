import {
  InvalidBodyFormatError,
  InvalidQueryFormatError,
} from "@errors/controller-error";
import { authorize } from "@middlewares/authorize";
import { ArticleService } from "@services/api/article-service";
import { ArticleValueTransformer } from "@tranformers/article-value-transformers";
import { CategoryValueTransformer } from "@tranformers/category-value-transformers";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ArticleController {
  public constructor(private readonly articleService: ArticleService) {}

  private static readonly paramsSchema = z.object({
    id: z.coerce.number().int().nonnegative(),
  });

  public async getOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const paramsSchema = ArticleController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    const response = await this.articleService.getOne(params.id);
    res.status(StatusCodes.OK).json(response);
  }

  private static readonly getManySchema = z.object({
    uploader: z.string().optional(),
    category: z.string().optional(),
    offset: z.coerce.number().int().optional(),
    limit: z.coerce.number().int().optional(),
  });

  public async getMany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const querySchema = ArticleController.getManySchema;
    const queryParseResult = await querySchema.safeParseAsync(req.query);
    if (!queryParseResult.success) {
      next(new InvalidQueryFormatError(queryParseResult.error));
      return;
    }
    const query = queryParseResult.data;

    const response = await this.articleService.getMany({
      uploaderUsername: query.uploader,
      categoryName:
        query.category !== undefined
          ? query.category.length === 0
            ? null
            : query.category
          : undefined,
      offset: query.offset,
      limit: query.limit,
    });
    res.status(StatusCodes.OK).json(response);
  }

  private static readonly postSchema = z.object({
    category: z.string().transform(CategoryValueTransformer.name).nullable(),
    thumbnail: z
      .object({
        name: z.string().transform(ArticleValueTransformer.thumbnailName),
        caption: z.string().transform(ArticleValueTransformer.thumbnailCaption),
      })
      .nullable(),
    title: z.string().transform(ArticleValueTransformer.title),
    subtitle: z.string().transform(ArticleValueTransformer.subtitle),
    content: z.string().transform(ArticleValueTransformer.content),
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

    const bodySchema = ArticleController.postSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    const response = await this.articleService.post(
      userUid,
      body.category,
      body.thumbnail,
      body.title,
      body.subtitle,
      body.content
    );
    res.status(StatusCodes.CREATED).json(response);
  }

  private static readonly patchSchema = z.object({
    category: z
      .string()
      .transform(CategoryValueTransformer.name)
      .nullable()
      .optional(),
    thumbnail: z
      .object({
        name: z.string().transform(ArticleValueTransformer.thumbnailName),
        caption: z.string().transform(ArticleValueTransformer.thumbnailCaption),
      })
      .nullable()
      .optional(),
    title: z.string().transform(ArticleValueTransformer.title).optional(),
    subtitle: z.string().transform(ArticleValueTransformer.subtitle).optional(),
    content: z.string().transform(ArticleValueTransformer.content).optional(),
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

    const paramsSchema = ArticleController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    const bodySchema = ArticleController.patchSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    await this.articleService.patch(userUid, params.id, body);
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

    const paramsSchema = ArticleController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    await this.articleService.delete(userUid, params.id);
    res.status(StatusCodes.CREATED).end();
  }

  public async like(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = ArticleController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    await this.articleService.like(params.id);
    res.status(StatusCodes.CREATED).end();
  }

  public async dislike(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = ArticleController.paramsSchema;
    const paramsParseResult = await paramsSchema.safeParseAsync(req.params);
    if (!paramsParseResult.success) {
      next();
      return;
    }
    const params = paramsParseResult.data;

    await this.articleService.dislike(params.id);
    res.status(StatusCodes.CREATED).end();
  }
}
