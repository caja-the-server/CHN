import type { Fetch } from "$lib/types/fetch";

const BASE_URL = "/cdn/thumbnails";

export async function postThumbnail(
  fetch: Fetch,
  blob: Blob,
): Promise<{ url: string; name: string }> {
  return Promise.reject();
}
