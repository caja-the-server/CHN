import { CategoryController } from "@controllers/api/category-controller";
import { database } from "@database/database";
import { CategoryService } from "@services/api/category-service";
import { bound } from "@utils/bound";
import { safeAsyncHandler as safe } from "@utils/safe-async-handler";
import { Router } from "express";

export const categoryRouter = Router();
const service = new CategoryService(database);
const controller = new CategoryController(service);
categoryRouter.get("/", safe(bound(controller, "getAll")));
categoryRouter.post("/", safe(bound(controller, "post")));
categoryRouter.patch("/:id", safe(bound(controller, "patch")));
categoryRouter.delete("/:id", safe(bound(controller, "delete")));
