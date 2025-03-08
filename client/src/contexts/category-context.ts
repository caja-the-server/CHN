import { Category } from "@services/category-service";
import { createContext } from "react";

export type CategoryContextData = Category[] | undefined;
export const CategoryContext = createContext<CategoryContextData>(undefined);
