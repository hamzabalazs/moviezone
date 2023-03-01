import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedApiContext } from "../common/testing/MockedApiProvider";
import Login from "./Login";

function renderLogin() {
  return render(
    <MemoryRouter>
      <MockedApiContext>
        <Login />
      </MockedApiContext>
    </MemoryRouter>
  );
}

test("login error happens if email empty", async () => {
  renderLogin();

  const loginFormEmail = screen.getByTestId("login-email") as HTMLInputElement;
  const loginButton = screen.getByRole("button", { name: "login.login" });

  expect(loginFormEmail.value).toBe("");
  expect(loginButton).toBeVisible();

  act(() => {
    fireEvent.click(loginButton);
  });
  await waitFor(() => {
    const loginErrorEmail = screen.getByTestId("login-error-email");
    expect(loginErrorEmail).toBeVisible();
    expect(loginErrorEmail).toHaveTextContent("formikErrors.emailReq");
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
    fireEvent.click(loginButton);
  });
  await waitFor(() => {
    const loginErrorPassword = screen.getByTestId("login-error-password");
    expect(loginErrorPassword).toBeVisible();
    expect(loginErrorPassword).toHaveTextContent("formikErrors.passwordReq");
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
