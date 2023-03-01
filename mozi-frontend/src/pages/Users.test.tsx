import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedApiContext } from "../common/testing/MockedApiProvider";
import { Users } from "./Users";

function renderUsers() {
  return render(
    <MemoryRouter>
      <MockedApiContext>
        <Users />
      </MockedApiContext>
    </MemoryRouter>
  );
}

test("correct amount of cards for users in context", () => {
  renderUsers();
  const cards = screen.getAllByTestId("user-card");
  expect(cards).toHaveLength(3);
});

test("user edit modal opens and shows correctly", () => {
  renderUsers();

  const cardEditButtons = screen.getAllByRole("button", { name: "Edit" });
  fireEvent.click(cardEditButtons[0]);
  const cardEditModal = screen.getByTestId("user-edit-modal");
  const cardEditModalButton = screen.getByRole("button", { name: "Edit" }); // not tested
  const userFirstName = screen.getByTestId("user-edit-modal-firstName");
  const userLastName = screen.getByTestId("user-edit-modal-lastName");
  const userEmail = screen.getByTestId("user-edit-modal-email");
  const userPassword = screen.getByTestId("user-edit-modal-password");
  const userRole = screen.getByTestId("user-edit-modal-role");

  expect(cardEditModal).not.toHaveAttribute("aria-hidden", "true");
  expect(cardEditModalButton).toBeInTheDocument();
  expect(userFirstName).toBeInTheDocument();
  expect(userLastName).toBeInTheDocument();
  expect(userEmail).toBeInTheDocument();
  expect(userPassword).toBeInTheDocument();
  expect(userRole).toBeInTheDocument();
});

test("user delete dialog opens and shows correctly", () => {
  renderUsers();

  const cardDeleteButtons = screen.getAllByRole("button", { name: "Delete" });
  fireEvent.click(cardDeleteButtons[0]);
  const cardDeleteDialog = screen.getByTestId("user-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", { name: "Accept" });
  const cardDeleteDialogQuit = screen.getByRole("button", { name: "Quit" });
  expect(cardDeleteDialog).not.toHaveAttribute("aria-hidden", "true");
  expect(cardDeleteDialogAccept).toBeInTheDocument();
  expect(cardDeleteDialogQuit).toBeInTheDocument();
});
