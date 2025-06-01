import { ResponsibleError } from "@errors/responsible-error";
import { StatusCodes } from "http-status-codes";

export class RouterError extends ResponsibleError {
  public constructor(statusCode: number, errorCode: string, message: string) {
    super(statusCode, errorCode, message);
  }
}

export class APINotFoundError extends RouterError {
  public constructor(message: string = "") {
    super(StatusCodes.NOT_FOUND, "API_NOT_FOUND", message);
  }
}

export class ResourceNotFoundError extends RouterError {
  public constructor(message: string = "") {
    super(StatusCodes.NOT_FOUND, "RESOURCE_NOT_FOUND", message);
  }
}
