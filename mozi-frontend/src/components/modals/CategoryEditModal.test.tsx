import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category } from "../../api/types";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import CategoryEditModal from "./CategoryEditModal";
import { SnackbarProvider } from "notistack";

const testCategory: Category = {
  id: "idC3",
  name: "categoryName",
};

const newtestCategory: Category = {
  id: "idC3",
  name: "EDITED",
};

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
    }
  }
`;
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

function renderCategoryEditModal(props: {
  category?: Category;
  onClose?: () => void;
}) {
  return render(
    <SnackbarProvider autoHideDuration={null}>
      <MockedProvider addTypename={false} mocks={[editMock]}>
        <MockedSessionContext>
          <CategoryEditModal
            category={props.category}
            onClose={props.onClose}
          />
        </MockedSessionContext>
      </MockedProvider>
    </SnackbarProvider>
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
    expect(screen.queryByText("successMessages.categoryEdit")).toBeInTheDocument();
  });
});
