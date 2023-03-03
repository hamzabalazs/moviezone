import { fireEvent, render, screen } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import CategoryDeleteDialog from "./CategoryDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderCategoryDeleteDialog(setIsOpenDelete: jest.Mock<any, any>) {
  const isOpenDelete = true;
  const categoryId = "idC2";
  return render(
    <MockedApiContext>
      <CategoryDeleteDialog
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
        categoryId={categoryId}
        setAlert={jest.fn()}

      />
    </MockedApiContext>
  );
}

test("category delete works fine", async () => {
  const setIsOpenDelete = jest.fn();
  renderCategoryDeleteDialog(setIsOpenDelete);

  const cardDeleteDialog = screen.getByTestId("category-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", {
    name: "buttons.accept",
  }); // not tested
  const cardDeleteDialogQuit = screen.getByRole("button", {
    name: "buttons.quit",
  });

  fireEvent.click(cardDeleteDialogQuit);
  expect(setIsOpenDelete).toHaveBeenCalledTimes(1);
});
