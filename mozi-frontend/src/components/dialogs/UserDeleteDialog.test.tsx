import { fireEvent, render, screen } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import UserDeleteDialog from "./UserDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderUserDeleteDialog(setIsOpenDelete: jest.Mock<any, any>) {
  const isOpenDelete = true;
  const userId = "idR2";
  return render(
    <MockedApiContext>
      <UserDeleteDialog
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
        userId={userId}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
      />
    </MockedApiContext>
  );
}

test("user delete works fine", async () => {
  const setIsOpenDelete = jest.fn();
  renderUserDeleteDialog(setIsOpenDelete);

  const cardDeleteDialog = screen.getByTestId("user-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", {
    name: "buttons.accept",
  }); // not tested
  const cardDeleteDialogQuit = screen.getByRole("button", {
    name: "buttons.quit",
  });

  fireEvent.click(cardDeleteDialogQuit);
  expect(setIsOpenDelete).toHaveBeenCalledTimes(1);
});
