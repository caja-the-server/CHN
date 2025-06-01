import { config } from "@config";
import { AuthController } from "@controllers/api/auth-controller";
import { database } from "@database/database";
import { AuthService } from "@services/api/auth-service";
import { bound } from "@utils/bound";
import { safeAsyncHandler as safe } from "@utils/safe-async-handler";
import { Router } from "express";

export const authRouter = Router();
const service = new AuthService(database, {
  passwordHashRounds: config.user.passwordHashRounds,
});
const controller = new AuthController(service);
authRouter.post(
  "/verify-auth-token",
  safe(bound(controller, "verifyAuthToken"))
);
authRouter.post("/signup", safe(bound(controller, "signup")));
authRouter.post("/signin", safe(bound(controller, "signin")));
authRouter.post("/signout", safe(bound(controller, "signout")));
authRouter.get("/me", safe(bound(controller, "getCurrentUser")));
authRouter.post("/update-password", safe(bound(controller, "updatePassword")));
