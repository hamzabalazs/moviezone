import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedApiContext } from "../common/testing/MockedApiProvider";
import Account from "./Account";

function renderAccount() {
  return render(
    <MemoryRouter>
      <MockedApiContext>
        <Account />
      </MockedApiContext>
    </MemoryRouter>
  );
}

test("only one user shows up", () => {
  renderAccount();

  const cards = screen.getAllByTestId("user-card");
  expect(cards).toHaveLength(1);
  const cardEditButtons = screen.getAllByRole("button", { name: "Edit" });
  const cardDeleteButtons = screen.getAllByRole("button", { name: "Delete" });
  expect(cardEditButtons).toHaveLength(1);
  expect(cardDeleteButtons).toHaveLength(1);
});

