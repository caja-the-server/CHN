import styles from "./styles.module.scss";

import { Logo } from "@components/Logo";
import { CategoryContext } from "@contexts/category-context";
import { CurrentUserContext } from "@contexts/current-user-context";
import { signout } from "@services/auth-service";
import { getDateTime } from "@utils/time";
import { FC, useCallback, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header: FC = () => {
  const currentUser = useContext(CurrentUserContext);
  const categories = useContext(CategoryContext);

  const navigate = useNavigate();

  const [dateTime, dateString] = useMemo(() => {
    const date = new Date();
    const dateTime = getDateTime(date);
    const dateString = date.toLocaleDateString("ko-KR");
    return [dateTime, dateString];
  }, []);

  const handleSignout = useCallback(async () => {
    await signout();
    navigate("/");
    navigate(0);
  }, [navigate]);

  return (
    <header className={styles.container}>
      <div className={styles.top}>
        <time className={styles.time} dateTime={dateTime}>
          {dateString}
        </time>
        <nav className={styles["user-nav"]}>
          {currentUser !== undefined &&
            (currentUser !== null ? (
              <>
                <Link className={styles.button} to="/myaccount">
                  {currentUser.name}
                </Link>
                <button className={styles.button} onClick={handleSignout}>
                  로그아웃
                </button>
                <Link className={styles.button} to="/myarticles">
                  내 기사
                </Link>
              </>
            ) : (
              <>
                <Link className={styles.button} to="/signup">
                  회원가입
                </Link>
                <Link className={styles.button} to="/signin">
                  로그인
                </Link>
              </>
            ))}
        </nav>
      </div>
      <div className={styles.mid}>
        <div className={styles.headline}>
          <Link className={styles.logo} to="/">
            <div>
              <Logo />
            </div>
            <div>
              <span>CHN</span>
              <span>Cheonan Jungang High School News</span>
            </div>
          </Link>
          <figure className={styles["caja-mark"]}>
            <img src="/caja-symbol.jpg" alt="천안중앙고심볼" />
            <figcaption>
              천안중앙
              <br />
              56대 학생회
            </figcaption>
          </figure>
        </div>
      </div>
      <div className={styles.bottom}>
        <nav className={styles["category-nav"]}>
          {categories !== undefined && (
            <>
              <Link className={styles["nav-button"]} to="/articles">
                전체
              </Link>
              <Link className={styles["nav-button"]} to="/articles?category=">
                카테고리 없음
              </Link>
              {categories.map(({ name: category }) => (
                <Link
                  key={category}
                  className={styles["nav-button"]}
                  to={`/articles?category=${category}`}
                >
                  {category}
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
