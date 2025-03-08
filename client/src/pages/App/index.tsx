import "normalize.css";
import "./styles.scss";

import {
  CategoryContext,
  CategoryContextData,
} from "@contexts/category-context";
import {
  CurrentUserContext,
  CurrentUserContextData,
} from "@contexts/current-user-context";
import { createTheme, ThemeProvider } from "@mui/material";
import { Articles } from "@pages/Articles";
import { Home } from "@pages/Home";
import { Layout } from "@pages/Layout";
import { MyAccount } from "@pages/MyAccount";
import { MyArticles } from "@pages/MyArticles";
import { NotFound } from "@pages/NotFound";
import { Signin } from "@pages/Sign/Signin";
import { Signup } from "@pages/Sign/Signup";
import { User } from "@pages/User";
import { ViewArticle } from "@pages/ViewArticle";
import { WriteArticle } from "@pages/WriteArticle";
import { getCurrentUser } from "@services/auth-service";
import { getCategories } from "@services/category-service";
import { FC, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const muiTheme = createTheme({
  typography: { button: { textTransform: "none" } },
  shape: { borderRadius: 0 },
  palette: {
    primary: { main: "#0823a8" },
    error: { main: "#ef4040" },
  },
});

export const App: FC = () => {
  const [currentUser, setCurrentUser] =
    useState<CurrentUserContextData>(undefined);
  const [category, setCategory] = useState<CategoryContextData>(undefined);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      setCurrentUser(currentUser);
    })();

    (async () => {
      const categories = await getCategories();
      setCategory(categories);
    })();
  }, []);

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <CategoryContext.Provider value={category}>
          {/* mui 테마 설정 */}
          <ThemeProvider theme={muiTheme}>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/myarticles" element={<MyArticles />} />
                  <Route path="/article/write" element={<WriteArticle />} />
                  <Route path="/article/:uid" element={<ViewArticle />} />
                  <Route path="/myaccount" element={<MyAccount />} />
                  <Route path="/:username" element={<User />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </CategoryContext.Provider>
      </CurrentUserContext.Provider>
    </>
  );
};
