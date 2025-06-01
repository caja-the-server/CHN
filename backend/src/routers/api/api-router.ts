import { APINotFoundError } from "@errors/router-error";
import { cors } from "@middlewares/cors";
import { responsibleErrorHandler } from "@middlewares/responsible-error-handler";
import { articleRouter } from "@routers/api/article-router";
import { authRouter } from "@routers/api/auth-router";
import { categoryRouter } from "@routers/api/category-router";
import { userRouter } from "@routers/api/user-router";
import { json, Router } from "express";

export const apiRouter = Router();
apiRouter.use(cors);
apiRouter.use(json());
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use((req, res, next) => {
  next(new APINotFoundError());
});
apiRouter.use(responsibleErrorHandler);
