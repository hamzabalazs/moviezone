import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import styles from "./styles";
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
} from "./auth/context/SessionContext";
import { SnackbarProvider } from "notistack";
import { User, UserRole } from "./gql/graphql";
import LoadingComponent from "./common/components/LoadingComponent";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const Home = lazy(() => import("./movies/pages/Home"));
const Login = lazy(() => import("./auth/pages/Login"));
const Categories = lazy(() => import("./categories/pages/Categories"));
const Reviews = lazy(() => import("./reviews/pages/Reviews"));
const MoviePage = lazy(() => import("./movies/pages/MoviePage"));
const CastPage = lazy(() => import("./cast/pages/CastPage"));
const Register = lazy(() => import("./users/pages/Register"));
const Forgotpass = lazy(() => import("./users/pages/Forgotpass"));
const Users = lazy(() => import("./users/pages/Users"));
const Account = lazy(() => import("./users/pages/Account"));
const ResetPassword = lazy(() => import("./users/pages/ResetPassword"));
const Dashboard = lazy(() => import("./users/pages/Dashboard"));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const httpLink = createHttpLink({
  uri: window.location.href.includes("localhost") ? "http://localhost:5000/graphql" : window.location.href.replace("3000","5000").replace(/.com\/(\w+)(\/.*)?/g,".com/") + "graphql",
});

// const httpLink = createHttpLink({
//   uri: 'https://moviezoneapp.com:5000/graphql'
// })

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      "auth-token": token ? token : "",
    },
  };
});

const eqSet = (xs: any, ys: any) => {
  if (xs.size === ys.size) {
    return [...xs].every((x) => ys.has(x));
  } else return [...ys].every((x) => xs.has(x));
};

const eqMovieListSet = (xs: any, ys: any) => {
  const isEqual = [...ys].find((x) => xs.has(x));
  if (isEqual === undefined) return true;
  return false;
};

const eqMovieIdSet = (xs: any, ys: any) => [...xs].every((x) => ys.has(x));

const isOrderedAsc = (set: any) => {
  const unordered = [...set];
  const ordered = [...set].sort();
  if (JSON.stringify(unordered) === JSON.stringify(ordered)) return true;
  return false;
};

const isOrderedDesc = (set: any) => {
  const unordered = [...set];
  const ordered = [...set].sort();
  ordered.reverse();
  if (JSON.stringify(unordered) === JSON.stringify(ordered)) return true;
  return false;
};

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getMovies: {
            keyArgs: ["orderByTitle,orderByCategory,searchField"],
            merge(existing: any[], incoming: any[], { args, readField }) {
              if (incoming.length === 0) return [];
              if (!args) return [];
              const merged = existing ? existing.slice(0) : [];
              if (incoming.length > 9) return [...merged]; //if new movie is added
              const existingIdSet = new Set(
                merged.map((movie) => readField("id", movie))
              );
              const incomingIdSet = new Set(
                incoming.map((movie) => readField("id", movie))
              );
              if (!eqMovieListSet(existingIdSet, incomingIdSet)) {
                return [...incoming];
              }
              const existingTitleSort = new Set(
                merged.map((movie) => readField("title", movie))
              );
              const existingCategorySort = new Set(
                merged.map((movie) =>
                  readField("id", readField("category", movie))
                )
              );
              if (args.input.offset === 0 && incoming.length !== 9)
                return [...incoming]; //if search has less than 9 elements
              if (args.input.searchField === "" && merged.length < 9)
                return [...incoming]; //search reset
              if (
                args.input.searchField !== "" &&
                incoming.length !== 9 &&
                merged.length < 9
              ) {
                return [...incoming];
              } // search after search
              if (args.input.orderByTitle !== undefined) {
                if (args.input.orderByTitle === true) {
                  if (!isOrderedAsc(existingTitleSort)) return [...incoming];
                } else if (args.input.orderByTitle === false) {
                  if (!isOrderedDesc(existingTitleSort)) return [...incoming];
                }
              }
              if (args.input.orderByCategory !== undefined) {
                if (args.input.orderByCategory === true) {
                  if (!isOrderedAsc(existingCategorySort)) return [...incoming];
                } else if (args.input.orderByCategory === false) {
                  if (!isOrderedDesc(existingCategorySort))
                    return [...incoming];
                }
              }
              return [...merged, ...incoming];
            },
          },
          getUsers: {
            keyArgs: ["id"],
            merge(existing: any[], incoming: any[], { readField }) {
              const merged = existing ? existing.slice(0) : [];
              const existingIdSet = new Set(
                merged.map((user) => readField("id", user))
              );
              const incomingIdSet = new Set(
                incoming.map((user) => readField("id", user))
              );
              if (merged.length - incoming.length === 1) {
                let isDelete = true;
                incomingIdSet.forEach((id) => {
                  if (!isDelete) return;
                  if (existingIdSet.has(id)) isDelete = true;
                  else isDelete = false;
                });
                if (isDelete) return [...incoming];
              }
              return [...merged, ...incoming];
            },
          },
          getReviewsOfUser: {
            keyArgs: ["id"],
            merge(existing: any[], incoming: any[], { readField }) {
              const merged = existing ? existing.slice(0) : [];
              const existingIdSet = new Set(
                merged.map((review) => readField("id", review))
              );
              const incomingIdSet = new Set(
                incoming.map((review) => readField("id", review))
              );
              if (eqSet(existingIdSet, incomingIdSet)) {
                return [...incoming];
              }
              if (merged.length - incoming.length === 1) {
                let isDelete = true;
                incomingIdSet.forEach((id) => {
                  if (!isDelete) return;
                  if (existingIdSet.has(id)) isDelete = true;
                  else isDelete = false;
                });
                if (isDelete) return [...incoming];
              }
              return [...merged, ...incoming];
            },
          },
          getReviewsOfMovie: {
            keyArgs: ["id"],
            merge(existing: any[], incoming: any[], { readField }) {
              const merged = existing ? existing.slice(0) : [];
              if (
                merged.length < 3 &&
                incoming.length <= 3 &&
                incoming.length - merged.length === 1
              )
                return [...incoming];
              if (
                merged.length < 3 &&
                incoming.length <= 3 &&
                incoming.length - merged.length !== 1 &&
                merged.length <= incoming.length
              )
                return [...merged, ...incoming];
              if (incoming.length > 3 && incoming.length - merged.length === 1)
                return [...merged];
              if (incoming.length === 0) return [];
              const existingIdSet = new Set(
                merged.map((review) => readField("id", review))
              );
              const incomingIdSet = new Set(
                incoming.map((review) => readField("id", review))
              );
              const existingMovieIdSet = new Set(
                merged.map((review) =>
                  readField("id", readField("movie", review))
                )
              );
              const incomingMovieIdSet = new Set(
                incoming.map((review) =>
                  readField("id", readField("movie", review))
                )
              );
              if (!eqMovieIdSet(existingMovieIdSet, incomingMovieIdSet)) {
                return [...incoming];
              }
              if (eqSet(existingIdSet, incomingIdSet)) {
                return [...incoming];
              }
              if (merged.length - incoming.length === 1) {
                const isDelete = eqSet(existingIdSet, incomingIdSet);
                if (isDelete) return [...incoming];
              }
              return [...merged, ...incoming];
            },
          },
        },
      },
    },
  }),
});

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <SnackbarProvider maxSnack={1}>
        <ApolloProvider client={client}>
          <MyThemeProvider>
            <BrowserRouter>
              <SessionContextProvider>
                <Suspense fallback={LoadingComponent(true)}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgotpass" element={<Forgotpass />} />
                    <Route
                      path="/resetpassword/:token"
                      element={<ResetPassword />}
                    />
                    <Route
                      path="dashboard"
                      element={
                        <RoleWrapper role={UserRole["Admin"]}>
                          <Dashboard />
                        </RoleWrapper>
                      }
                    />
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
                    <Route
                      path="/cast/:currmovie_id/:currcast_id"
                      element={<CastPage />}
                    ></Route>
                    <Route path="account" element={<Account />}></Route>
                  </Routes>
                </Suspense>
              </SessionContextProvider>
            </BrowserRouter>
          </MyThemeProvider>
        </ApolloProvider>
      </SnackbarProvider>
    </I18nextProvider>
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
