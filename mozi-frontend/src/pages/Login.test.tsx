import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphQLError } from "graphql";
import { MemoryRouter } from "react-router-dom";
import { LOGIN } from "../api/auth/useLogIn";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import Login from "./Login";

const mockLoginData = {
  request: {
    query: LOGIN,
    variables: { input: { email: "admin@example.com", password: "admin" } },
  },
  result: {
    data: {
      createToken: {
        id: "idU1",
        first_name: "admin",
        last_name: "admin",
        role: "admin",
        email: "admin@example.com",
        token: "token1",
      },
    },
  },
};

function renderLogin(logInMock?: jest.Mock<any, any>) {
  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false} mocks={[mockLoginData]}>
        <MockedSessionContext value={{ logIn: logInMock }}>
          <Login />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

test("login is called if inputs are not empty", async () => {
  const logInMock = jest.fn();
  renderLogin(logInMock);

  const loginFormEmail = screen.getByTestId("login-email") as HTMLInputElement;
  const loginFormPassword = screen.getByTestId(
    "login-password"
  ) as HTMLInputElement;
  const loginButton = screen.getByRole("button", { name: "login.login" });

  act(() => {
    fireEvent.change(loginFormEmail, {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(loginFormPassword, { target: { value: "admin" } });
    userEvent.click(loginButton);
  });

  await waitFor(() => {
    expect(logInMock).toHaveBeenCalled();
  });
});

test("login error happens if email empty", async () => {
  renderLogin();

  const loginFormEmail = screen.getByTestId("login-email") as HTMLInputElement;
  const loginButton = screen.getByRole("button", { name: "login.login" });

  expect(loginFormEmail.value).toBe("");
  expect(loginButton).toBeVisible();

  act(() => {
    userEvent.click(loginButton);
  });
  await waitFor(() => {
    const loginErrors = screen.getAllByTestId("login-errors");
    expect(loginErrors[0]).toBeVisible();
    expect(loginErrors[0]).toHaveTextContent("formikErrors.emailReq");
  });
});

test("login error happens if password is empty", async () => {
  renderLogin();

  const loginFormPassword = screen.getByTestId(
    "login-password"
  ) as HTMLInputElement;
  const loginButton = screen.getByRole("button", { name: "login.login" });
  expect(loginFormPassword.value).toBe("");

  act(() => {
    userEvent.click(loginButton);
  });
  await waitFor(() => {
    const loginErrors = screen.getAllByTestId("login-errors");
    expect(loginErrors[1]).toBeVisible();
    expect(loginErrors[1]).toHaveTextContent("formikErrors.passwordReq");
  });
});

test("login form works correctly", () => {
  renderLogin();

  const loginFormEmail = screen.getByTestId("login-email") as HTMLInputElement;
  const loginFormPassword = screen.getByTestId(
    "login-password"
  ) as HTMLInputElement;
  act(() => {
    fireEvent.change(loginFormEmail, { target: { value: "changeEmail" } });
    fireEvent.change(loginFormPassword, {
      target: { value: "changePassword" },
    });
  });

  expect(loginFormEmail.value).toBe("changeEmail");
  expect(loginFormPassword.value).toBe("changePassword");
});

test("login register link has correct href", () => {
  renderLogin();

  const loginRegisterLink = screen.getByRole("link", {
    name: "login.noAccount",
  });
  expect(loginRegisterLink).toBeVisible();
  expect(loginRegisterLink).toHaveAttribute("href", "/register");
});

test("login forgotpass link has correct href", () => {
  renderLogin();

  const loginForgotPassLink = screen.getByRole("link", {
    name: "login.forgotPass",
  });
  expect(loginForgotPassLink).toBeVisible();
  expect(loginForgotPassLink).toHaveAttribute("href", "/forgotpass");
});
