import { getCurrentUser } from "$lib/services/auth-service.js";
import { getCategories } from "$lib/services/category-service.js";

export async function load({ fetch, cookies }) {
  const categories = await getCategories(fetch);
  const currentUser = await getCurrentUser(fetch, cookies);

  return { categories, currentUser };
}
