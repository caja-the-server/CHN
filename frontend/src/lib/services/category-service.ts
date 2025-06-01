import type { Fetch } from "$lib/types/fetch";
import { z } from "zod";

const BASE_URL = "/api/categories";

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Category = z.infer<typeof categorySchema>;

const getCategoriesResponseSchema = z.array(categorySchema);
export type GetCategoriesResponse = z.infer<typeof getCategoriesResponseSchema>;

// export const getCategories = createService(z.array(categorySchema), () => [BASE_URL])

export async function getCategories(fetch: Fetch): Promise<GetCategoriesResponse> {
  return [
    { id: "it", name: "IT" },
    { id: "business", name: "경영" },
    { id: "economics", name: "경제" },
    { id: "science", name: "과학" },
    { id: "finance", name: "금융" },
    { id: "clubs", name: "동아리" },
    { id: "literature", name: "문학" },
    { id: "events", name: "이벤트" },
    { id: "others", name: "기타" },
  ];
}
