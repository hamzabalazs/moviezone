import { render, screen, waitFor } from "@testing-library/react";
import { MockedSessionContext } from "../testing/MockedSessionProvider";
import "@testing-library/jest-dom/extend-expect";
import { themeSwitchContext } from "../../themeSwitchContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import styles from "../../styles";
import { MemoryRouter, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { CurrentUser, UserRole } from "../../gql/graphql";
import NavigationBar from "./NavigationBar";
import { MockedProvider } from "@apollo/client/testing";

function renderNavbar(user?: CurrentUser) {
  return render(
    <MockedProvider addTypename={false}>
      <MemoryRouter initialEntries={["/"]}>
        <MockedSessionContext value={{ user }}>
          <NavigationBar />
          <DisplayRoute />
        </MockedSessionContext>
      </MemoryRouter>
    </MockedProvider>
  );
}

function DisplayRoute() {
  const location = useLocation();
  return <div data-testid="test-location">{location.pathname}</div>;
}

const adminUser: CurrentUser = {
  id: "idU1",
  first_name: "admin",
  last_name: "admin",
  email: "admin@example.com",
  role: UserRole["Admin"],
  token: "token1",
};
const viewerUser: CurrentUser = {
  id: "idU3",
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  role: UserRole["Viewer"],
  token: "token3",
};

test("home link works", () => {
  renderNavbar(viewerUser);
  const homeLink = screen.getByTestId("navbar-home-link");
  const homeIcon = screen.getByTestId("navbar-home-icon");
  expect(homeLink).toBeVisible();
  expect(homeIcon).toBeVisible();
  expect(homeLink).toHaveAttribute("href", "/");
  expect(homeIcon).toHaveAttribute("href", "/");
});

test("categories link works", () => {
  renderNavbar(adminUser);
  const categoriesLink = screen.getByTestId("navbar-categories-link");
  expect(categoriesLink).toBeVisible();
  expect(categoriesLink).toHaveAttribute("href", "/categories");
});

test("Users link works", () => {
  renderNavbar(adminUser);
  const usersLink = screen.getByTestId("navbar-categories-link");
  expect(usersLink).toBeVisible();
  expect(usersLink).toHaveAttribute("href", "/categories");
});

test("review link works", () => {
  renderNavbar(viewerUser);
  const reviewLink = screen.getByTestId("navbar-myreviews-link");
  expect(reviewLink).toBeVisible();
  expect(reviewLink).toHaveAttribute("href", "/reviews");
});

test("Language menu works", () => {
  renderNavbar(adminUser);

  const languageMenu = screen.getByTestId("navbar-language-menu");
  userEvent.click(languageMenu);
  const languageEnMenuItem = screen.getByTestId("navbar-language-en");
  const languageHuMenuItem = screen.getByTestId("navbar-language-hu");

  expect(languageMenu).toBeVisible();
  expect(languageEnMenuItem).toBeVisible();
  expect(languageEnMenuItem).toHaveTextContent("English");
  expect(languageHuMenuItem).toBeVisible();
  expect(languageHuMenuItem).toHaveTextContent("Hungarian");
});

test("User menu works", () => {
  renderNavbar(adminUser);

  const userAvatarMenu = screen.getByTestId("navbar-account-bubble");
  userEvent.click(userAvatarMenu);
  const accountMenuItem = screen.getByTestId("navbar-account-menuitem");
  const logoutMenuItem = screen.getByTestId("navbar-logout-menuitem");

  expect(userAvatarMenu).toBeVisible();
  expect(accountMenuItem).toBeVisible();
  expect(accountMenuItem).toHaveTextContent("My account");
  expect(logoutMenuItem).toBeVisible();
  expect(logoutMenuItem).toHaveTextContent("Logout");
});

test("navbar languageChange works", async () => {
  renderNavbar(adminUser);

  const categoriesLink = screen.getByTestId("navbar-categories-link");
  const usersLink = screen.getByTestId("navbar-users-link");

  expect(categoriesLink).toHaveTextContent("Categories");
  expect(usersLink).toHaveTextContent("Users");

  const languageMenu = screen.getByTestId("navbar-language-menu");
  userEvent.click(languageMenu);
  const languageEnMenuItem = screen.getByTestId("navbar-language-en");
  const languageHuMenuItem = screen.getByTestId("navbar-language-hu");

  expect(languageEnMenuItem).toHaveTextContent("English");
  expect(languageHuMenuItem).toHaveTextContent("Hungarian");
  userEvent.click(languageHuMenuItem);
  await waitFor(() => {
    expect(languageEnMenuItem).toHaveTextContent("Angol");
    expect(languageHuMenuItem).toHaveTextContent("Magyar");
    expect(categoriesLink).toHaveTextContent("Kategóriák");
    expect(usersLink).toHaveTextContent("Felhasználók");
  });
});

test("navbar colorchange function calls", async () => {
  let checked = false;

  const switchMode = jest.fn();

  const theme = styles();
  render(
    <MemoryRouter initialEntries={["/testroute"]}>
      <MockedProvider addTypename={false}>
        <MockedSessionContext>
          <themeSwitchContext.Provider
            value={{ mode: checked ? "dark" : "light", switchMode }}
          >
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <NavigationBar />
              <DisplayRoute />
            </ThemeProvider>
          </themeSwitchContext.Provider>
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );

  const themeSwitcher = screen.getByLabelText("Dark Mode");

  expect(switchMode).toHaveBeenCalledTimes(0);

  userEvent.click(themeSwitcher);

  await waitFor(() => {
    expect(switchMode).toHaveBeenCalledTimes(1);
  });
});
