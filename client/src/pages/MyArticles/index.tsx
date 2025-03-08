import styles from "./styles.module.scss";

import { FC } from "react";
import { Link } from "react-router-dom";

export const MyArticles: FC = () => {
  return (
    <>
      <Link className={styles["post-article-button"]} to="/article/write">
        새 기사
      </Link>
    </>
  );
};
