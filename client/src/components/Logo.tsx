import { FC } from "react";
import CHNLogo from "../assets/favicon.svg?react";
import styles from "../styles/Logo.module.scss";

export const Logo: FC = () => {
  return <CHNLogo className={styles.logo} />;
};
