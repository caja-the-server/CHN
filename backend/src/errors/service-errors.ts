import { ResponsibleError } from "@errors/responsible-error";
import { StatusCodes } from "http-status-codes";

export class ServiceError extends ResponsibleError {
  public constructor(statusCode: number, errorCode: string, message: string) {
    super(statusCode, errorCode, message);
  }
}

export class PermissionDeniedError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.FORBIDDEN, "PERMISSION_DENIED", message);
  }
}

export class InvalidAuthTokenError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.BAD_REQUEST, "INVALID_AUTH_TOKEN", message);
  }
}

export class UsernameAlreadyTakenError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.UNPROCESSABLE_ENTITY, "USERNAME_ALREADY_TAKEN", message);
  }
}

export class InvalidUsernameError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.BAD_REQUEST, "INVALID_USERNAME", message);
  }
}

export class IncorrectPasswordError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.UNAUTHORIZED, "INCORRECT_PASSWORD", message);
  }
}

export class UserNotFoundError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.NOT_FOUND, "USER_NOT_FOUND", message);
  }
}

export class CategoryNotFoundError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.NOT_FOUND, "CATEGORY_NOT_FOUND", message);
  }
}

export class ArticleNotFoundError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.NOT_FOUND, "ARTICLE_NOT_FOUND", message);
  }
}

export class ImageNotFoundError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.NOT_FOUND, "IMAGE_NOT_FOUND", message);
  }
}

export class QueryLimitOutOfBoundsError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.BAD_REQUEST, "QUERY_LIMIT_OUT_OF_BOUNDS", message);
  }
}

export class QueryOffsetOutOfBoundsError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.BAD_REQUEST, "QUERY_OFFSET_OUT_OF_BOUNDS", message);
  }
}

export class UnsupportedImageFormatError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.BAD_REQUEST, "UNSUPPORTED_IMAGE_FORMAT", message);
  }
}

export class InvalidImageSizeError extends ServiceError {
  public constructor(message: string = "") {
    super(StatusCodes.BAD_REQUEST, "INVALID_IMAGE_SIZE", message);
  }
}
