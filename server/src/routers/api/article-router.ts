import { config } from "@config";
import { ArticleController } from "@controllers/api/article-controller";
import { database } from "@database/database";
import { env } from "@env";
import { ArticleService } from "@services/api/article-service";
import { bound } from "@utils/bound";
import { safeAsyncHandler as safe } from "@utils/safe-async-handler";
import { Router } from "express";

export const articleRouter = Router();
const service = new ArticleService(database, {
  ...config.article,
  thumbnailBaseUrl: new URL("/cdn/thumbnails/", env.SERVER_URL),
  defaultThumbnailName: config.thumbnail.defaultName,
});
const controller = new ArticleController(service);
articleRouter.get("/:id", safe(bound(controller, "getOne")));
articleRouter.get("/", safe(bound(controller, "getMany")));
articleRouter.post("/", safe(bound(controller, "post")));
articleRouter.patch("/:id", safe(bound(controller, "patch")));
articleRouter.delete("/:id", safe(bound(controller, "delete")));
articleRouter.post("/:id/like", safe(bound(controller, "like")));
articleRouter.post("/:id/dislike", safe(bound(controller, "dislike")));
