import type { Fetch } from "$lib/types/fetch";

const BASE_URL = "/api/articles";

export type Article = {
  uid: number;
  uploader: {
    username: string;
    name: string;
  } | null;
  category: string | null;
  thumbnail: {
    url: string;
    name: string;
    caption: string;
  };
  title: string;
  subtitle: string;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ContentLessArticle = Omit<Article, "content">;

export async function getArticle(fetch: Fetch, uid: number): Promise<Article> {
  return Promise.reject();
}

export async function getArticles(
  fetch: Fetch,
  params: {
    uploader?: string;
    category?: string | null;
    limit: number;
    offset: number;
  },
): Promise<{ total: number; items: ContentLessArticle[] }> {
  return { total: 0, items: [] };
}

export async function postArticle(
  fetch: Fetch,
  article: {
    category: string | null;
    thumbnail: { name: string; caption: string } | null;
    title: string;
    subtitle: string;
    content: string;
  },
): Promise<{ uid: number }> {
  return Promise.reject();
}

export async function patchArticle(
  fetch: Fetch,
  uid: number,
  data: {
    category?: string | null;
    thumbnail?: { name: string; caption: string } | null;
    title?: string;
    subtitle?: string;
    content?: string;
  },
): Promise<void> {
  return Promise.reject();
}

export async function deleteArticle(fetch: Fetch, uid: number): Promise<void> {
  return Promise.reject();
}

export async function likeAritlce(fetch: Fetch, uid: number): Promise<void> {
  return Promise.reject();
}
