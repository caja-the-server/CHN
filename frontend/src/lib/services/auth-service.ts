import type { Fetch } from "$lib/types/fetch";
import type { Cookies } from "@sveltejs/kit";

const BASE_URL = "/api/auth";

export type ProtectedUser = {
  username: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
};
export async function verifyAuthToken(fetch: Fetch, value: string): Promise<boolean> {
  return false;
}

export async function getCurrentUser(
  fetch: Fetch,
  cookies: Cookies,
): Promise<ProtectedUser | null> {
  const signedin = Math.random() < 0.5;
  return signedin
    ? { username: "tester", name: "Tester", isAdmin: true, createdAt: "undefined" }
    : null;
}

export async function signup(
  fetch: Fetch,
  token: string,
  username: string,
  password: string,
  name: string,
): Promise<void> {
  return Promise.reject();
}

export async function signin(fetch: Fetch, username: string, password: string): Promise<void> {
  return Promise.reject();
}

export async function signout(fetch: Fetch): Promise<void> {
  return Promise.reject();
}

export async function updatePassword(
  fetch: Fetch,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  return Promise.reject();
}
