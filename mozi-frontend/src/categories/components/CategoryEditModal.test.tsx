import { gql, InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryEditModal from "./CategoryEditModal";
import { SnackbarProvider } from "notistack";
import { Category, CurrentUser } from "../../gql/graphql";
import { UPDATE_CATEGORY } from "../categoryQueries";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import { MemoryRouter } from "react-router-dom";

const testCategory: Category = {
  id: "idC3",
  name: "name3",
};

const newtestCategory: Category = {
  id: "idC3",
  name: "EDITED",
};

const editMock = {
  request: {
    query: UPDATE_CATEGORY,
    variables: {
      input: {
        id: testCategory.id,
        name: newtestCategory.name,
      },
    },
  },
  result: {
    data: {
      updateCategory: {
        id: testCategory.id,
        name: newtestCategory.name,
      },
    },
  },
};

const cache = new InMemoryCache();

function renderCategoryEditModal(props: {
  category?: Category;
  onClose?: () => void;
  user?: CurrentUser;
}) {
  return render(
    <MemoryRouter>
      <SnackbarProvider autoHideDuration={null}>
        <MockedProvider mocks={[editMock]} cache={cache}>
          <MockedSessionContext value={{ user: props.user }}>
            <CategoryEditModal
              category={props.category}
              onClose={props.onClose}
            />
          </MockedSessionContext>
        </MockedProvider>
      </SnackbarProvider>
    </MemoryRouter>
  );
}

test("If category is not provided should not open", () => {
  const { queryByTestId } = renderCategoryEditModal({});

  const modal = queryByTestId("category-edit-modal");
  const editButton = queryByTestId("category-edit-modal-edit");

  expect(modal).not.toBeInTheDocument();
  expect(editButton).not.toBeInTheDocument();
});

test("If category is provided should open modal with correct values", () => {
  const { getByTestId } = renderCategoryEditModal({ category: testCategory });

  const modal = getByTestId("category-edit-modal");
  const name = getByTestId("category-edit-modal-name");

  expect(modal).toBeInTheDocument();
  expect(name).toBeInTheDocument();
  expect(name).toHaveValue(testCategory.name);
});

test("calls editcategory with correct values", async () => {
  const { getByTestId } = renderCategoryEditModal({
    category: testCategory,
  });

  const name = getByTestId("category-edit-modal-name") as HTMLInputElement;
  const editButton = getByTestId("category-edit-modal-edit");
  expect(screen.queryByText("Success")).not.toBeInTheDocument();
  expect(name.value).toBe(testCategory.name);

  fireEvent.change(name, { target: { value: newtestCategory.name } });
  await waitFor(() => {
    expect(name.value).toBe(newtestCategory.name);
  });
  act(() => {
    userEvent.click(editButton);
  });

  await waitFor(() => {
    expect(
      screen.queryByText("successMessages.categoryEdit")
    ).toBeInTheDocument();
  });
});
