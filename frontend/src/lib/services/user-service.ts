import type { Fetch } from "$lib/types/fetch";

const BASE_URL = "/api/users";

export type PublicUser = {
  username: string;
  name: string;
};

export async function getUser(fetch: Fetch, username: string): Promise<PublicUser> {
  return Promise.reject();
}

export async function patchUser(
  fetch: Fetch,
  data: { username?: string; name?: string },
): Promise<void> {
  return Promise.reject();
}

export async function deleteUser(fetch: Fetch): Promise<void> {
  return Promise.reject();
}
