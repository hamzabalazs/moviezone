import { fireEvent, render, screen } from "@testing-library/react";
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

test("user edit modal opens and shows correctly", () => {
  renderAccount();

  const cardEditButton = screen.getByRole("button", { name: "Edit" });

  fireEvent.click(cardEditButton);

  const cardEditModalButton = screen.getByRole("button", { name: "Edit" });
  const cardEditModal = screen.getByTestId("user-current-edit-modal");
  const userFirstName = screen.getByTestId("user-edit-modal-firstName");
  const userLastName = screen.getByTestId("user-edit-modal-lastName");
  const userEmail = screen.getByTestId("user-edit-modal-email");
  const userPassword = screen.getByTestId("user-edit-modal-password");
  expect(cardEditModal).not.toHaveAttribute("aria-hidden", "true");
  expect(userFirstName).toBeInTheDocument();
  expect(userLastName).toBeInTheDocument();
  expect(userEmail).toBeInTheDocument();
  expect(userPassword).toBeInTheDocument();
  expect(cardEditModalButton).toBeInTheDocument();
});

test("user delete dialog opens and shows correctly", () => {
  renderAccount();

  const cardDeleteButton = screen.getByRole("button", { name: "Delete" });
  fireEvent.click(cardDeleteButton);
  const cardDeleteDialog = screen.getByTestId("user-current-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", { name: "Accept" });
  const cardDeleteDialogQuit = screen.getByRole("button", { name: "Quit" });
  expect(cardDeleteDialog).not.toHaveAttribute("aria-hidden", "true");
  expect(cardDeleteDialogAccept).toBeInTheDocument();
  expect(cardDeleteDialogQuit).toBeInTheDocument();
});
