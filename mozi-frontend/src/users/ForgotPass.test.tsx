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
import Forgotpass from "./Forgotpass";

function renderForgotPass() {
  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false}>
        <MockedSessionContext>
          <Forgotpass />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

test("Should show LoadingComponent while loading, after loading should not show loadingcomponent",async() => {
  renderForgotPass();

  const loader = screen.queryByTestId("loader")
  expect(loader).toBeInTheDocument()
  await waitFor(() => {
    expect(loader).not.toBeInTheDocument()
  })
})

test("forgotpass error happens if email empty", async () => {
  renderForgotPass();

  const forgotButton = await screen.findByRole("button", {
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

  const forgotFormEmail = await screen.findByTestId(
    "forgot-email"
  ) as HTMLInputElement;
  expect(forgotFormEmail.value).toBe("");

  await act(async () => {
    fireEvent.change(forgotFormEmail, { target: { value: "changeEmail" } });
  });
  expect(forgotFormEmail.value).toBe("changeEmail");
});

test("forgotpass link has href", async() => {
  renderForgotPass();

  const forgotLoginLink = await screen.findByRole("link", {
    name: "forgotPass.hasAccount",
  });
  expect(forgotLoginLink).toBeVisible();
  expect(forgotLoginLink).toHaveAttribute("href", "/login");
});
