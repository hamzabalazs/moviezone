import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedApiContext } from "../common/testing/MockedApiProvider";
import Forgotpass from "./Forgotpass";

function renderForgotPass() {
  return render(
    <MemoryRouter>
      <MockedApiContext>
        <Forgotpass />
      </MockedApiContext>
    </MemoryRouter>
  );
}

test("forgotpass error happens if email empty", async () => {
  renderForgotPass();

  const forgotButton = screen.getByRole("button", {
    name: "forgotPass.passwordReset",
  });
  expect(forgotButton).toHaveAttribute("type", "submit");
  userEvent.click(forgotButton);
  await waitFor(() => {
    const forgotErrorEmail = screen.getByTestId("forgot-error-email");
    expect(forgotErrorEmail).toHaveTextContent("formikErrors.emailReq");
  });
});

test("forgotpass form works fine", async () => {
  renderForgotPass();

  const forgotFormEmail = screen.getByTestId(
    "forgot-email"
  ) as HTMLInputElement;
  expect(forgotFormEmail.value).toBe("");

  await act(async () => {
    fireEvent.change(forgotFormEmail, { target: { value: "changeEmail" } });
  });
  expect(forgotFormEmail.value).toBe("changeEmail");
});

test("forgotpass link has href", () => {
  renderForgotPass();

  const forgotLoginLink = screen.getByRole("link", {
    name: "forgotPass.hasAccount",
  });
  expect(forgotLoginLink).toBeVisible();
  expect(forgotLoginLink).toHaveAttribute("href", "/login");
});
