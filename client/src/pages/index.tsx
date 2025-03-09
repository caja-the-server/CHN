import { Pagination } from "@mui/material";
import styles from "./styles.module.scss";

import { ContentLessArticle, getArticles } from "@services/article-service";
import { getTimeData } from "@utils/time";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
const MAIN_ARTICLE_DISPLAY_AMOUNT = 2;
const EVENT_CATEGORY = "이벤트";
const EVENT_DISPLAY_AMOUNT = 3;

export const Home: FC = () => {
  type Articles = Awaited<ReturnType<typeof getArticles>> | undefined;
  const [articles, setArticles] = useState<Articles>(undefined);
  const [mainArticles, subArticles] = useMemo(() => {
    if (articles === undefined) {
      return [[], []];
    }
    const items = articles.items;
    const mainArticles = items.slice(0, MAIN_ARTICLE_DISPLAY_AMOUNT);
    const subArticles = items.slice(MAIN_ARTICLE_DISPLAY_AMOUNT);
    return [mainArticles, subArticles];
  }, [articles]);
  const [eventPage, setEventPage] = useState<number>(1);
  const [eventPageCount, setEventPageCount] = useState<number>(0);
  const [eventArticles, setEventArticles] = useState<Articles>(undefined);
  const onEventPageChange = useCallback(async (_: unknown, page: number) => {
    setEventPage(page);
  }, []);

  useEffect(() => {
    getArticles({
      category: EVENT_CATEGORY,
      limit: EVENT_DISPLAY_AMOUNT,
      offset: EVENT_DISPLAY_AMOUNT * (eventPage - 1),
    }).then((eventArticles) => {
      const eventPageCount = Math.ceil(
        eventArticles.total / EVENT_DISPLAY_AMOUNT
      );
      setEventArticles(eventArticles);
      setEventPageCount(eventPageCount);
    });
  }, [eventPage]);

  useEffect(() => {
    (async () => {
      const articles = await getArticles({ limit: ARTICLE_LIMIT, offset: 0 });
      setArticles(articles);
    })();
    const interval = setInterval(() => {
      setEventPageCount((pageCount: number) => {
        setEventPage((prevPage: number) => {
          const newPage = prevPage + 1;
          return newPage <= pageCount ? newPage : 1;
        });
        return pageCount;
      });
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles["event-container"]}>
          <div className={styles.contents}>
            {eventArticles?.items.map((article) => (
              <div key={article.uid} className={styles.event}>
                <EventArticle article={article} />
              </div>
            ))}
          </div>
          <div className={styles.pages}>
            <Pagination
              count={eventPageCount}
              page={eventPage}
              onChange={onEventPageChange}
              size="small"
              showFirstButton
              showLastButton
            />
          </div>
        </div>
        <hr className={styles["horizental-divider"]} />
        <main className={styles["main-container"]}>
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
        </main>
      </div>
    </>
  );
};
