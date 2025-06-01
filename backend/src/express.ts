import { env } from "@env";
import { errorHandler } from "@middlewares/error-handler";
import { requestLogger } from "@middlewares/request-logger";
import { session } from "@middlewares/session";
import { apiRouter } from "@routers/api/api-router";
import { cdnRouter } from "@routers/cdn/cdn-router";
import { NODE_ENV } from "@utils/node-env";
import Express from "express";

export const express = Express();
express.use(requestLogger);
express.use(session);
express.use("/api", apiRouter);
express.use("/cdn", cdnRouter);

if (NODE_ENV === "production") {
  express.use(Express.static(env.STATIC_SERVE_PATH, { index: undefined }));
  express.use("*", (req, res) => {
    res.sendFile(env.INDEX_PATH);
  });
}

express.use(errorHandler);
