import { MockedProvider } from "@apollo/client/testing";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import Register from "./Register";

function renderRegister() {
  return render(
    <MemoryRouter>
      <MockedProvider>
        <MockedSessionContext>
          <Register />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

test("register error if first_name is empty", async () => {
  renderRegister();

  const registerFormFirstName = screen.getByTestId(
    "register-first_name"
  ) as HTMLInputElement;
  const registerButton = screen.getByRole("button", {
    name: "register.register",
  });
  expect(registerFormFirstName.value).toBe("");

  act(() => {
    userEvent.click(registerButton);
  });
  await waitFor(() => {
    const registerErrors = screen.getAllByTestId("register-errors");
    expect(registerErrors[0]).toHaveTextContent("formikErrors.firstNameReq");
  });
});

test("register error if last_name is empty", async () => {
  renderRegister();

  const registerFormLastName = screen.getByTestId(
    "register-last_name"
  ) as HTMLInputElement;
  const registerButton = screen.getByRole("button", {
    name: "register.register",
  });
  expect(registerFormLastName.value).toBe("");

  act(() => {
    userEvent.click(registerButton);
  });
  await waitFor(() => {
    const registerErrors = screen.getAllByTestId("register-errors");
    expect(registerErrors[1]).toHaveTextContent("formikErrors.lastNameReq");
  });
});

test("register error if email is empty", async () => {
  renderRegister();

  const registerFormEmail = screen.getByTestId(
    "register-email"
  ) as HTMLInputElement;
  const registerButton = screen.getByRole("button", {
    name: "register.register",
  });
  expect(registerFormEmail.value).toBe("");

  act(() => {
    userEvent.click(registerButton);
  });
  await waitFor(() => {
    const registerErrors = screen.getAllByTestId("register-errors");
    expect(registerErrors[2]).toHaveTextContent("formikErrors.emailReq");
  });
});

test("register error if password is empty", async () => {
  renderRegister();

  const registerFormPassword = screen.getByTestId(
    "register-password"
  ) as HTMLInputElement;
  const registerButton = screen.getByRole("button", {
    name: "register.register",
  });
  expect(registerFormPassword.value).toBe("");

  act(() => {
    userEvent.click(registerButton);
  });
  await waitFor(() => {
    const registerErrors = screen.getAllByTestId("register-errors");
    expect(registerErrors[3]).toHaveTextContent("formikErrors.passwordReq");
  });
});

test("register login link has correct href", async () => {
  renderRegister();
  const registerLoginLink = screen.getByRole("link", {
    name: "register.hasAccount",
  });
  expect(registerLoginLink).toBeVisible();
  expect(registerLoginLink).toHaveAttribute("href", "/login");
});

test("register form works fine", () => {
  renderRegister();

  const registerFormFirstName = screen.getByTestId(
    "register-first_name"
  ) as HTMLInputElement;
  const registerFormLastName = screen.getByTestId(
    "register-last_name"
  ) as HTMLInputElement;
  const registerFormEmail = screen.getByTestId(
    "register-email"
  ) as HTMLInputElement;
  const registerFormPassword = screen.getByTestId(
    "register-password"
  ) as HTMLInputElement;

  expect(registerFormFirstName.value).toBe("");
  expect(registerFormLastName.value).toBe("");
  expect(registerFormEmail.value).toBe("");
  expect(registerFormPassword.value).toBe("");

  fireEvent.change(registerFormFirstName, {
    target: { value: "changeFirstName" },
  });
  fireEvent.change(registerFormLastName, {
    target: { value: "changeLastName" },
  });
  fireEvent.change(registerFormEmail, { target: { value: "changeEmail" } });
  fireEvent.change(registerFormPassword, {
    target: { value: "changePassword" },
  });

  expect(registerFormFirstName.value).toBe("changeFirstName");
  expect(registerFormLastName.value).toBe("changeLastName");
  expect(registerFormEmail.value).toBe("changeEmail");
  expect(registerFormPassword.value).toBe("changePassword");
});
