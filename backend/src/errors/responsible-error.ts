import { Response } from "express";

export class ResponsibleError extends Error {
  public constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string
  ) {
    super(message);
  }

  response(res: Response): ReturnType<Response["send"]> {
    return res.status(this.statusCode).json({
      errorCode: this.errorCode,
      message: this.message,
      ...this.addtionalProps,
    });
  }

  protected get addtionalProps(): object | undefined {
    return;
  }
}
