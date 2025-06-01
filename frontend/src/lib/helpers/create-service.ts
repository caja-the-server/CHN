import type { Fetch } from "$lib/types/fetch";
import type { z } from "zod";

export function createService<
  Schema extends z.ZodType,
  Params extends unknown[],
  Return = z.infer<Schema>,
>(
  schema: Schema,
  fetchParams: (...params: Params) => Parameters<Fetch>,
): (fetch: Fetch, ...params: Params) => Promise<Return> {
  return async (fetch, ...params) => {
    const [input, init] = fetchParams(...params);
    const response = await fetch(input, init);
    if (!response.ok) {
      return Promise.reject();
    }
    const data = await response.json();
    const parsedData = await schema.parseAsync(data);
    return parsedData;
  };
}
