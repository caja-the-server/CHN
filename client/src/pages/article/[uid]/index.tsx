import styles from "./styles.module.scss";
import "./styles.scss";

import { QuillEditor } from "@components/QuillEditor";
import { NotFound } from "@pages/404";
import {
  Article,
  dislikeAritlce,
  getArticle,
  likeAritlce,
} from "@services/article-service";
import { getTimeData } from "@utils/time";
import Quill from "quill";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const quillModules = {
  toolbar: false,
};

export const ViewArticle: FC = () => {
  const params = useParams();

  type ArticleState =
    | { state: "UNSET" }
    | { state: "NOT_FOUND" }
    | { state: "SET"; data: Article };
  const [article, setArticle] = useState<ArticleState>({ state: "UNSET" });
  const [uid, setUid] = useState<number>();

  const quillRef = useRef<Quill>(null);

  useEffect(() => {
    (async () => {
      const rawUid = params.uid;
      if (rawUid === undefined) {
        setArticle({ state: "NOT_FOUND" });
        return;
      }

      const uid = parseInt(rawUid);
      if (isNaN(uid) || uid < 0) {
        setArticle({ state: "NOT_FOUND" });
        return;
      }

      setUid(uid);

      try {
        const article = await getArticle(uid);
        setArticle({ state: "SET", data: article });
      } catch {
        setArticle({ state: "NOT_FOUND" });
      }
    })();
  }, [params]);

  useEffect(() => {
    if (quillRef.current === null) {
      return;
    }
    if (article.state !== "SET") {
      return;
    }
    quillRef.current.setContents(JSON.parse(article.data.content).ops);
  }, [article]);

  const handleLikeButtonClick = useCallback(async () => {
    const reactedArticlesKey = "reactedArticles";
    const reactedArticles = JSON.parse(
      localStorage.getItem(reactedArticlesKey) ?? "[]"
    ) as number[];
    if (reactedArticles.includes(uid!)) {
      return;
    }
    await likeAritlce(uid!);
    reactedArticles.push(uid!);
    localStorage.setItem(reactedArticlesKey, JSON.stringify(reactedArticles));
    try {
      const article = await getArticle(uid!);
      setArticle({ state: "SET", data: article });
    } catch {
      setArticle({ state: "NOT_FOUND" });
    }
  }, [uid]);
  const handleDislikeButtonClick = useCallback(async () => {
    const reactedArticlesKey = "reactedArticles";
    const reactedArticles = JSON.parse(
      localStorage.getItem(reactedArticlesKey) ?? "[]"
    ) as number[];
    if (reactedArticles.includes(uid!)) {
      return;
    }
    await dislikeAritlce(uid!);
    reactedArticles.push(uid!);
    localStorage.setItem(reactedArticlesKey, JSON.stringify(reactedArticles));
    try {
      const article = await getArticle(uid!);
      setArticle({ state: "SET", data: article });
    } catch {
      setArticle({ state: "NOT_FOUND" });
    }
  }, [uid]);

  switch (article.state) {
    case "UNSET":
      return <></>;

    case "NOT_FOUND":
      return <NotFound />;

    case "SET":
      const { data } = article;
      const today = new Date(data.createdAt);
      const [dateTime, dateString, dateTitle] = getTimeData(today);
      return (
        <>
          <article className={styles.article}>
            <header className={styles.header}>
              <section className={styles.headline}>
                <h2 className={styles.title}>{data.title}</h2>
                <h4 className={styles.subtitle}>{data.subtitle}</h4>
                <footer className={styles.footer}>
                  <span>{data.uploader?.name ?? "삭제된 유저"} 작성</span>
                  <time dateTime={dateTime} title={dateTitle}>
                    {dateString}
                  </time>
                </footer>
              </section>
              <hr className={styles.divider} />
              <figure className={styles.thumbnail}>
                <img src={data.thumbnail.url} alt="" />
                <figcaption>{data.thumbnail.caption}</figcaption>
              </figure>
            </header>
            <main>
              <QuillEditor
                ref={quillRef}
                mode="read"
                theme="snow"
                modules={quillModules}
              />
            </main>
            <footer className={styles["footer"]}>
              <button
                className={styles["like-button"]}
                onClick={handleLikeButtonClick}
              >
                <span>좋아요 {article.data.likeCount}</span>
              </button>
              <button
                className={styles["dislike-button"]}
                onClick={handleDislikeButtonClick}
              >
                <span>싫어요 {article.data.dislikeCount}</span>
              </button>
            </footer>
          </article>
        </>
      );
  }
  article satisfies never;
};
