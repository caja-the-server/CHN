import { InvalidBodyFormatError } from "@errors/controller-error";
import { authorize } from "@middlewares/authorize";
import { AuthService } from "@services/api/auth-service";
import { UserValueTransformer } from "@tranformers/user-value-transformers";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  private static readonly verifyAuthTokenSchema = z.object({
    value: z.string(),
  });

  public async verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const bodySchema = AuthController.verifyAuthTokenSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    const valid = await this.authService.verifyAuthToken(body.value);
    res.status(valid ? StatusCodes.OK : StatusCodes.UNPROCESSABLE_ENTITY).end();
  }

  public async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const response = await this.authService.getCurrentUser(req.session);
    res.status(StatusCodes.OK).json(response);
  }

  private static readonly signupSchema = z.object({
    token: z.string(),
    username: z.string().transform(UserValueTransformer.username),
    password: z.string().transform(UserValueTransformer.password),
    name: z.string().transform(UserValueTransformer.name),
  });

  public async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const bodySchema = AuthController.signupSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    await this.authService.signup(req.session, body);
    res.status(StatusCodes.CREATED).end();
  }

  private static readonly signinSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  public async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const bodySchema = AuthController.signinSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    await this.authService.signin(req.session, body);
    res.status(StatusCodes.CREATED).end();
  }

  public async signout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await this.authService.signout(req.session);
    res.status(StatusCodes.CREATED).end();
  }

  private static readonly updatePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().transform(UserValueTransformer.password),
  });

  public async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userUid = authorize(req, res, next);
    if (userUid === undefined) {
      return;
    }

    const bodySchema = AuthController.updatePasswordSchema;
    const bodyParseResult = await bodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      next(new InvalidBodyFormatError(bodyParseResult.error));
      return;
    }
    const body = bodyParseResult.data;

    await this.authService.updatePassword(
      userUid,
      body.currentPassword,
      body.newPassword
    );
    res.status(StatusCodes.CREATED).end();
  }
}
