import { fireEvent, render, screen } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";

import UserCurrentDeleteDialog from "./UserCurrentDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderCurrUserDeleteDialog(setIsOpenDelete: jest.Mock<any, any>) {
  const isOpenDelete = true;
  const userId = "idR2";
  return render(
    <MockedApiContext>
      <UserCurrentDeleteDialog
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
        userId={userId}
      />
    </MockedApiContext>
  );
}

test("review delete works fine", async () => {
  const setIsOpenDelete = jest.fn();
  renderCurrUserDeleteDialog(setIsOpenDelete);

  const cardDeleteDialog = screen.getByTestId("user-current-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", {
    name: "buttons.accept",
  }); // not tested
  const cardDeleteDialogQuit = screen.getByRole("button", {
    name: "buttons.quit",
  });

  fireEvent.click(cardDeleteDialogQuit);
  expect(setIsOpenDelete).toHaveBeenCalledTimes(1);
});
