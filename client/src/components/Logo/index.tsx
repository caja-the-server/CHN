import styles from "./styles.module.scss";

import CHNLogo from "@assets/logo.svg?react";
import { FC } from "react";

export const Logo: FC = () => {
  return <CHNLogo className={styles.logo} />;
};
