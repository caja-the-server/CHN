import { ResponsibleError } from "@errors/responsible-error";
import { extractIssue } from "@utils/extract-issue";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ControllerError extends ResponsibleError {
  public constructor(statusCode: number, errorCode: string, message: string) {
    super(statusCode, errorCode, message);
  }
}

export class InvalidBodyFormatError extends ControllerError {
  public constructor(
    private readonly zodError: z.ZodError,
    message: string = ""
  ) {
    super(StatusCodes.BAD_REQUEST, "INVALID_BODY_FORMAT", message);
  }

  override get addtionalProps() {
    return { details: extractIssue(this.zodError) };
  }
}

export class InvalidQueryFormatError extends ControllerError {
  public constructor(
    private readonly zodError: z.ZodError,
    message: string = ""
  ) {
    super(StatusCodes.BAD_REQUEST, "INVALID_QUERY_FORMAT", message);
  }

  override get addtionalProps() {
    return { details: extractIssue(this.zodError) };
  }
}

export class UnauthorizedRequestError extends ControllerError {
  public constructor(
    message: string = "Access denied. Please login to continue."
  ) {
    super(StatusCodes.UNAUTHORIZED, "UNAUTHORIZED_REQUEST", message);
  }
}

export class TooManyRequestError extends ControllerError {
  public constructor(
    message: string = "Too many requests, please try again later"
  ) {
    super(StatusCodes.TOO_MANY_REQUESTS, "TOO_MANY_REQUESTS", message);
  }
}

export class FileTooLargeError extends ControllerError {
  public constructor(message: string = "") {
    super(StatusCodes.REQUEST_TOO_LONG, "FILE_TOO_LARGE", message);
  }
}

export class UnsupportedFileError extends ControllerError {
  public constructor(message: string = "") {
    super(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "UNSUPPORTED_FILE", message);
  }
}

export class InternalError extends ControllerError {
  public constructor(message: string = "Unexcepted error occured") {
    super(StatusCodes.INTERNAL_SERVER_ERROR, "UNKNOWN_INTERNAL_ERROR", message);
  }
}
