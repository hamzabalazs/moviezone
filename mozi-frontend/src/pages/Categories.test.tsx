import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedApiContext } from "../common/testing/MockedApiProvider";
import Categories from "./Categories";

function renderCategories() {
  return render(
    <MemoryRouter>
      <MockedApiContext>
        <Categories />
      </MockedApiContext>
    </MemoryRouter>
  );
}

global.fetch = jest.fn();

test("same amount of cards as categories?", () => {
  renderCategories();

  const cards = screen.getAllByTestId("category-card");
  expect(cards).toHaveLength(3);
  //mock context has 3 categories
});

test("category edit modal opens and shows correctly", () => {
  renderCategories();

  const cardEditButtons = screen.getAllByRole("button", { name: "Edit" });

  fireEvent.click(cardEditButtons[0]);
  const cardEditModal = screen.getByTestId("category-edit-modal");
  const cardEditName = screen.getByTestId("category-edit-modal-name");
  const cardEditModalButton = screen.getByRole("button", { name: "Edit" });
  expect(cardEditModal).not.toHaveAttribute("aria-hidden", "true");
  expect(cardEditName).toBeInTheDocument();
  expect(cardEditModalButton).toBeInTheDocument();
});

test("category delete dialog opens and shows correctly", () => {
  renderCategories();
  const cardDeleteButtons = screen.getAllByRole("button", { name: "Delete" });

  fireEvent.click(cardDeleteButtons[0]);
  const cardDeleteDialog = screen.getByTestId("category-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", { name: "Accept" });
  const cardDeleteDialogQuit = screen.getByRole("button", { name: "Quit" });
  expect(cardDeleteDialog).not.toHaveAttribute("aria-hidden", "true");
  expect(cardDeleteDialogAccept).toBeInTheDocument();
  expect(cardDeleteDialogQuit).toBeInTheDocument();
});

test("category add modal opens and shows correctly", () => {
  renderCategories();

  const cardAddButton = screen.getByTestId("category-add-button");

  fireEvent.click(cardAddButton);
  const cardAddModal = screen.getByTestId("category-add-modal");
  const cardAddModalName = screen.getByTestId("category-add-name");
  const cardAddModalButton = screen.getByRole("button", { name: "Add" });
  expect(cardAddModal).not.toHaveAttribute("aria-hidden", "true");
  expect(cardAddModalName).toBeInTheDocument();
  expect(cardAddModalButton).toBeInTheDocument();
});

test("category add modal works fine", async () => {
  renderCategories();

  const cardAddButton = screen.getByTestId("category-add-button");

  fireEvent.click(cardAddButton);

  await waitFor(async () => {
    const cardAddModalName = screen.getByTestId(
      "category-add-name"
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(cardAddModalName, { target: { value: "changeName" } });
    });
    expect(cardAddModalName.value).toBe("changeName");
  });
});
