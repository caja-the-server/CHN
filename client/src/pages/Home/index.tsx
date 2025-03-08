import styles from "./styles.module.scss";

import { ContentLessArticle, getArticles } from "@services/article-service";
import { getTimeData } from "@utils/time";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";

type ArticleProps = {
  article: ContentLessArticle;
};

const Article: FC<ArticleProps> = (props) => {
  const { article } = props;
  const [dateTime, dateString, dateTitle] = useMemo(() => {
    const date = new Date(article.createdAt);
    return getTimeData(date);
  }, [article.createdAt]);

  return (
    <article className={styles.article}>
      <a className={styles["article-anchor"]} href={`/article/${article.uid}`}>
        <figure className={styles.thumbnail}>
          <img
            alt={article.thumbnail.caption}
            src={article.thumbnail.url}
          ></img>
        </figure>
        <header>
          <h2 className={styles.title}>{article.title}</h2>
        </header>
        <main>
          {article.subtitle && (
            <p className={styles.subtitle}>{article.subtitle}</p>
          )}
        </main>
      </a>
      <footer className={styles.footer}>
        <span>{article.uploader?.name ?? "삭제된 유저"} 작성</span>
        <time dateTime={dateTime} title={dateTitle}>
          {dateString}
        </time>
      </footer>
    </article>
  );
};

type EventArticleProps = {
  article: ContentLessArticle;
};

const EventArticle: FC<EventArticleProps> = (props) => {
  const { article } = props;

  return (
    <article className={styles.article}>
      <a className={styles["article-anchor"]} href={`/article/${article.uid}`}>
        <figure className={styles.thumbnail}>
          <img
            alt={article.thumbnail.caption}
            src={article.thumbnail.url}
          ></img>
        </figure>
        <header>
          <h2 className={styles.title}>{article.title}</h2>
        </header>
        <main>
          {article.subtitle && (
            <p className={styles.subtitle}>{article.subtitle}</p>
          )}
        </main>
      </a>
    </article>
  );
};

const ARTICLE_LIMIT = 5;
const MAIN_ARTICLE_AMOUNT = 2;

export const Home: FC = () => {
  type Articles = Awaited<ReturnType<typeof getArticles>> | undefined;
  const [articles, setArticles] = useState<Articles>(undefined);
  const [mainArticles, subArticles] = useMemo(() => {
    if (articles === undefined) {
      return [[], []];
    }
    const items = articles.items;
    const mainArticles = items.slice(0, MAIN_ARTICLE_AMOUNT);
    const subArticles = items.slice(MAIN_ARTICLE_AMOUNT);
    return [mainArticles, subArticles];
  }, [articles]);
  const [eventArticles, setEventArticles] = useState<Articles>(undefined);
  const [leftEventArticle, rightEventArticle] = useMemo(() => {
    if (eventArticles === undefined) {
      return [undefined, undefined];
    }
    const items = eventArticles.items;
    const leftEventArticle = items.at(1);
    const rightEventArticle = items.at(0);
    return [leftEventArticle, rightEventArticle];
  }, [eventArticles]);

  useEffect(() => {
    (async () => {
      const articles = await getArticles({ limit: ARTICLE_LIMIT, offset: 0 });
      setArticles(articles);
    })();
    (async () => {
      const eventArticles = await getArticles({
        category: "이벤트",
        limit: 2,
        offset: 0,
      });
      setEventArticles(eventArticles);
    })();
  }, []);

  return (
    <>
      <div className={styles["article-container"]}>
        <main>
          {(() => {
            const nodes: ReactNode[] = [];
            if (mainArticles.length > 0) {
              const firstArticle = mainArticles[0];
              nodes.push(
                <Article key={firstArticle.uid} article={firstArticle} />
              );
              for (const article of mainArticles.slice(1)) {
                nodes.push(
                  <hr
                    key={`hr${article.uid}`}
                    className={styles["horizental-divider"]}
                  />
                );
                nodes.push(<Article key={article.uid} article={article} />);
              }
            }
            return nodes;
          })()}
        </main>
        <hr className={styles["vertical-divider"]} />
        <aside>
          {(() => {
            const nodes: ReactNode[] = [];
            if (subArticles.length > 0) {
              const firstArticle = subArticles[0];
              nodes.push(
                <Article key={firstArticle.uid} article={firstArticle} />
              );
              for (const article of subArticles.slice(1)) {
                nodes.push(
                  <hr
                    key={`hr${article.uid}`}
                    className={styles["horizental-divider"]}
                  />
                );
                nodes.push(<Article key={article.uid} article={article} />);
              }
            }
            return nodes;
          })()}
        </aside>
        <aside className={styles["left-event-panel"]}>
          {leftEventArticle !== undefined && (
            <EventArticle article={leftEventArticle} />
          )}
        </aside>
        <aside className={styles["right-event-panel"]}>
          {rightEventArticle !== undefined && (
            <EventArticle article={rightEventArticle} />
          )}
        </aside>
      </div>
    </>
  );
};
