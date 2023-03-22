import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgotpass from "./pages/Forgotpass";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import styles from "./styles";
import Categories from "./pages/Categories";
import { Users } from "./pages/Users";
import Reviews from "./pages/Reviews";
import MoviePage from "./pages/MoviePage";
import Account from "./pages/Account";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { themeSwitchContext } from "./themeSwitchContext";
import { setContext } from "@apollo/client/link/context";
import {
  SessionContextProvider,
  useSessionContext,
} from "./api/SessionContext";
import { SnackbarProvider } from "notistack";
import { User, UserRole } from "./gql/graphql";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      "auth-token": token ? token : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={1}>
      <ApolloProvider client={client}>
        <MyThemeProvider>
          <BrowserRouter>
            <SessionContextProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgotpass" element={<Forgotpass />} />
                <Route
                  path="categories"
                  element={
                    <RoleWrapper role={UserRole["Editor"]}>
                      <Categories />
                    </RoleWrapper>
                  }
                />
                <Route
                  path="reviews"
                  element={
                    <RoleWrapper role={UserRole["Viewer"]}>
                      <Reviews />
                    </RoleWrapper>
                  }
                />
                <Route
                  path="users"
                  element={
                    <RoleWrapper role={UserRole["Admin"]}>
                      <Users />
                    </RoleWrapper>
                  }
                ></Route>
                <Route
                  path="/movie/:currmovie_id"
                  element={<MoviePage />}
                ></Route>
                <Route path="account" element={<Account />}></Route>
              </Routes>
            </SessionContextProvider>
          </BrowserRouter>
        </MyThemeProvider>
      </ApolloProvider>
    </SnackbarProvider>
  </React.StrictMode>
);

function RoleWrapper({
  children,
  role,
}: {
  children?: React.ReactNode;
  role?: User["role"];
}): JSX.Element {
  const { hasRole } = useSessionContext();

  if (role && !hasRole(role)) {
    return <Navigate to="/"></Navigate>;
  }

  return <>{children}</>;
}

export function MyThemeProvider({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("color-mode") === "dark") setChecked(true);
  }, []);

  const switchMode = () => {
    setChecked((checked) => {
      const newValue = !checked;
      localStorage.setItem("color-mode", newValue ? "dark" : "light");
      return newValue;
    });
  };

  const theme = styles();

  return (
    <themeSwitchContext.Provider
      value={{ mode: checked ? "dark" : "light", switchMode }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </themeSwitchContext.Provider>
  );
}

reportWebVitals();
