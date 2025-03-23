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
  dislikeCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ContentLessArticle = Omit<Article, "content">;

export async function getArticle(uid: number): Promise<Article> {
  const response = await fetch(`/api/articles/${uid}`);
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
}

export async function getArticles(params: {
  uploader?: string;
  category?: string | null;
  limit: number;
  offset: number;
}): Promise<{ total: number; items: ContentLessArticle[] }> {
  const response = await fetch(
    `/api/articles?${new URLSearchParams({
      ...(params.category !== undefined && {
        category: params.category ?? "",
      }),
      limit: String(params.limit),
      offset: String(params.offset),
    })}`
  );
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
}

export async function postArticle(article: {
  category: string | null;
  thumbnail: { name: string; caption: string } | null;
  title: string;
  subtitle: string;
  content: string;
}): Promise<{ uid: number }> {
  const response = await fetch("/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });
  if (!response.ok) {
    return Promise.reject(await response.json());
  }
  return await response.json();
}

export async function patchArticle(
  uid: number,
  data: {
    category?: string | null;
    thumbnail?: { name: string; caption: string } | null;
    title?: string;
    subtitle?: string;
    content?: string;
  }
): Promise<void> {
  const response = await fetch(`/api/articles/${uid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category: data.category,
      thumbnail: data.thumbnail,
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
    }),
  });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function deleteArticle(uid: number): Promise<void> {
  const response = await fetch(`/api/articles/${uid}`, { method: "DELETE" });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function likeAritlce(uid: number): Promise<void> {
  const response = await fetch(`/api/articles/${uid}/like`, { method: "POST" });
  if (!response.ok) {
    return Promise.reject();
  }
}

export async function dislikeAritlce(uid: number): Promise<void> {
  const response = await fetch(`/api/articles/${uid}/dislike`, {
    method: "POST",
  });
  if (!response.ok) {
    return Promise.reject();
  }
}
