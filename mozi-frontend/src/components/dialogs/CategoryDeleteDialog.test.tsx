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
import CategoryDeleteDialog from "./CategoryDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const testCategory: Category = {
  id: "idC3",
  name: "categoryName",
};

function renderCategoryDeleteDialog(props: {
  category?: Category;
  onClose?: () => void;
}) {
  return render(
    <MockedSessionContext>
      <CategoryDeleteDialog
        category={props.category}
        onClose={props.onClose}
      />
    </MockedSessionContext>
  );
}

test("If category is not provided should not open", () => {
  const { queryByTestId } = renderCategoryDeleteDialog({});

  const dialog = queryByTestId("category-delete-dialog");

  expect(dialog).not.toBeInTheDocument();
});

test("If category is provided should open dialog", () => {
  const { queryByTestId } = renderCategoryDeleteDialog({
    category: testCategory,
  });

  const dialog = queryByTestId("category-delete-dialog");
  const acceptButton = queryByTestId("category-delete-dialog-accept");
  const quitButton = queryByTestId("category-delete-dialog-quit");

  expect(dialog).toBeInTheDocument();
  expect(acceptButton).toBeInTheDocument();
  expect(quitButton).toBeInTheDocument();
});

test("Should call onClose when quit is clicked", async () => {
  const onCloseSpy = jest.fn();
  const { getByTestId } = renderCategoryDeleteDialog({
    category: testCategory,
    onClose: onCloseSpy,
  });

  const quitButton = getByTestId("category-delete-dialog-quit");
  expect(onCloseSpy).toHaveBeenCalledTimes(0);
  act(() => {
    userEvent.click(quitButton);
  });

  await waitFor(() => {
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});

// test("Should call deleteCategory and alert", async () => {
//   const deleteCategorySpy = jest.fn();
//   const { getByTestId } = renderCategoryDeleteDialog({
//     category: testCategory,
//     deleteCategory: deleteCategorySpy,
//   });

//   const acceptButton = getByTestId("category-delete-dialog-accept")

//   act(() => {
//     userEvent.click(acceptButton)
//   })

//   await waitFor(() => {
//     expect(deleteCategorySpy).toHaveBeenCalledWith(testCategory.id)
//   })


// });
