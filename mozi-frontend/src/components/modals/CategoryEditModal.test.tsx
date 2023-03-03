import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryData } from "../../api/category/useCategories";
import { Category } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import CategoryEditModal from "./CategoryEditModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const testCategory: Category = {
  id: "idC3",
  name: "categoryName",
};

const newtestCategory: Category = {
  id: "idC3",
  name: "EDITED",
};

function renderCategoryEditModal(props: {
  category?: Category;
  onClose?: () => void;
  editCategory?: CategoryData["editCategory"];
}) {
  return render(
    <MockedApiContext value={{ editCategory: props.editCategory }}>
      <CategoryEditModal category={props.category} onClose={props.onClose} />
    </MockedApiContext>
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
  const editCategorySpy = jest.fn();
  const { getByTestId } = renderCategoryEditModal({
    category: testCategory,
    editCategory: editCategorySpy,
  });

  const name = getByTestId("category-edit-modal-name")
  const editButton = getByTestId("category-edit-modal-edit")

  fireEvent.change(name,{target:{value:newtestCategory.name}})

  act(() => {
    userEvent.click(editButton)
  })

  await waitFor(() => {
    expect(editCategorySpy).toHaveBeenCalledWith(newtestCategory)
  })
});
