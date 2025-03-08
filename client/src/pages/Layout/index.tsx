import styles from "./styles.module.scss";

import { Header } from "@components/Header";
import { FC } from "react";
import { Outlet } from "react-router-dom";

export const Layout: FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.decoline}></div>
        <div className={styles["children-container"]}>
          <Header />
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
        <div className={styles.decoline}></div>
      </div>
    </>
  );
};
