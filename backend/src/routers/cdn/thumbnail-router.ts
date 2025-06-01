import { config } from "@config";
import { ImageController } from "@controllers/cdn/image-controller";
import { env } from "@env";
import { TooManyRequestError } from "@errors/controller-error";
import { ImageService } from "@services/cdn/image-service";
import { bound } from "@utils/bound";
import { safeAsyncHandler as safe } from "@utils/safe-async-handler";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import mime from "mime";

export const thumbnailRouter = Router();
const conf = config.thumbnail;
const service = new ImageService(conf);
const controller = new ImageController(service, {
  ...conf,
  supportedMIMETypes: conf.supportedFormats
    .map((format) => mime.getType(format))
    .filter(Boolean) as string[],
  baseUrl: new URL("/cdn/thumbnails/", env.SERVER_URL),
});

thumbnailRouter.get("/:name", safe(bound(controller, "get")));

const rateLimiter = rateLimit({
  windowMs: conf.rateWindow,
  limit: conf.rateLimit,
  handler(req, res, next) {
    next(new TooManyRequestError());
  },
});

thumbnailRouter.post("/", rateLimiter, safe(bound(controller, "post")));
