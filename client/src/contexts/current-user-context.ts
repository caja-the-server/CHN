import { ProtectedUser } from "@services/auth-service";
import { createContext } from "react";

export type CurrentUserContextData = ProtectedUser | null | undefined;
export const CurrentUserContext =
  createContext<CurrentUserContextData>(undefined);
