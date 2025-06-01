import type { Fetch } from "$lib/types/fetch";

const BASE_URL = "/cdn/images";

export async function postImage(fetch: Fetch, blob: Blob): Promise<{ url: string; name: string }> {
  return Promise.reject();
}
