import styles from "./styles.module.scss";

import { Pagination } from "@mui/material";
import { ContentLessArticle, getArticles } from "@services/article-service";
import { getTimeData } from "@utils/time";
import {
  ChangeEvent,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
          <img alt="" src={article.thumbnail.url} />
        </figure>
        <section className={styles.content}>
          <header>
            <h2 className={styles.title}>{article.title}</h2>
          </header>
          <main className={styles.main}>
            <p className={styles.subtitle}>{article.subtitle}</p>
          </main>
        </section>
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

const LIMIT = 10;

export const Articles: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category: string | null = useMemo(() => {
    return searchParams.get("category");
  }, [searchParams]);

  const page: number = useMemo(() => {
    const param = searchParams.get("page");
    if (param === null) {
      return 1;
    }
    const page = parseInt(param);
    if (isNaN(page) || page < 1) {
      return NaN;
    }
    return page;
  }, [searchParams]);

  const [articles, setArticles] = useState<
    | { state: "UNSET" }
    | { state: "ERROR" }
    | {
        state: "SET";
        data: { total: number; items: ContentLessArticle[] };
      }
  >({ state: "UNSET" });

  const handlePageChange = useCallback(
    (_: ChangeEvent<unknown>, value: number) => {
      navigate(
        `/articles?` +
          new URLSearchParams({
            ...(category !== null && { category }),
            page: value.toString(),
          })
      );
    },
    [navigate, category]
  );

  useEffect(() => {
    (async () => {
      if (isNaN(page)) {
        return;
      }

      try {
        const articles = await getArticles({
          ...(category !== null && { category }),
          limit: LIMIT,
          offset: LIMIT * (page - 1),
        });
        setArticles({
          state: "SET",
          data: articles,
        });
      } catch {
        setArticles({
          state: "ERROR",
        });
      }
    })();
  }, [page, category]);

  return (
    <>
      {articles.state === "SET" && (
        <>
          {articles.data.items.length === 0 ? (
            <h2 className={styles["no-article-title"]}>
              기사가 존재하지 않습니다
            </h2>
          ) : (
            <>
              <ol className={styles.articles}>
                {(() => {
                  const nodes: ReactNode[] = [];
                  function getNode(article: ContentLessArticle) {
                    return (
                      <li key={article.uid}>
                        <Article article={article} />
                      </li>
                    );
                  }
                  const items = articles.data.items;
                  nodes.push(getNode(items[0]));
                  for (const item of items.slice(1)) {
                    nodes.push(
                      <hr key={`hr${item.uid}`} className={styles.divider} />
                    );
                    nodes.push(getNode(item));
                  }
                  return nodes;
                })()}
              </ol>
              <Pagination
                page={page}
                count={Math.ceil(articles.data.total / LIMIT)}
                onChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
