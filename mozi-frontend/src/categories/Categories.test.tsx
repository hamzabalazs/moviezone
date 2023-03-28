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
import Categories from "./Categories";
import { GET_CATEGORIES } from "./categoryQueries";

const mockCategoryData = {
  request: {
    query: GET_CATEGORIES,
  },
  result: {
    data: {
      getCategories: [
        {
          id: "idC1",
          name: "name1",
        },
        {
          id: "idC2",
          name: "name2",
        },
        {
          id: "idC3",
          name: "name3",
        },
        {
          id: "idC4",
          name: "name4",
        },
      ],
    },
  },
};

function renderCategories() {
  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false} mocks={[mockCategoryData]}>
        <MockedSessionContext>
          <Categories />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

test("LoadingComponent should show while loading, after loading should not show", async () => {
  const { queryByTestId } = renderCategories();

  const loader = queryByTestId("loader");
  expect(loader).toBeInTheDocument();

  await waitFor(() => {
    expect(loader).not.toBeInTheDocument();
  });
});

test("Should have same amount of cards as categories", async () => {
  renderCategories();

  const cards = await screen.findAllByTestId("category-card");
  expect(cards).toHaveLength(4);
});

test("category edit modal opens and shows correctly", async () => {
  renderCategories();

  const cardEditButtons = await screen.findAllByRole("button", {
    name: "Edit",
  });

  userEvent.click(cardEditButtons[0]);
  const cardEditModal = screen.getByTestId("category-edit-modal");
  const cardEditName = screen.getByTestId("category-edit-modal-name");
  const cardEditModalButton = screen.getByRole("button", { name: "Edit" });
  expect(cardEditModal).not.toHaveAttribute("aria-hidden", "true");
  expect(cardEditName).toBeInTheDocument();
  expect(cardEditModalButton).toBeInTheDocument();
});

test("category delete dialog opens and shows correctly", async () => {
  renderCategories();
  const cardDeleteButtons = await screen.findAllByRole("button", {
    name: "Delete",
  });

  userEvent.click(cardDeleteButtons[0]);
  const cardDeleteDialog = screen.getByTestId("category-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", { name: "Accept" });
  const cardDeleteDialogQuit = screen.getByRole("button", { name: "Quit" });
  expect(cardDeleteDialog).not.toHaveAttribute("aria-hidden", "true");
  expect(cardDeleteDialogAccept).toBeInTheDocument();
  expect(cardDeleteDialogQuit).toBeInTheDocument();
});

test("category add modal opens and shows correctly", async () => {
  renderCategories();

  const cardAddButton = await screen.findByTestId("category-add-button");

  userEvent.click(cardAddButton);
  const cardAddModal = screen.getByTestId("category-add-modal");
  const cardAddModalName = screen.getByTestId("category-add-name");
  const cardAddModalButton = screen.getByRole("button", { name: "Add" });
  expect(cardAddModal).not.toHaveAttribute("aria-hidden", "true");
  expect(cardAddModalName).toBeInTheDocument();
  expect(cardAddModalButton).toBeInTheDocument();
});

test("category add modal works fine", async () => {
  renderCategories();

  const cardAddButton = await screen.findByTestId("category-add-button");

  userEvent.click(cardAddButton);

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
