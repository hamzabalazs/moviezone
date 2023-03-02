import { fireEvent, render, screen } from "@testing-library/react";
import { User } from "../../api/types";
import { UserData } from "../../api/user/useUsers";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import UserDeleteDialog from "./UserDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const testUser: User = {
  id: "idU3",
  firstName: "viewer",
  lastName: "viewer",
  email: "viewer@example.com",
  password: "viewer",
  role: "viewer",
};

function renderUserDeleteDialog(props: {
  user?:User;
  onClose?:() => void;
  deleteUser?: UserData["deleteUser"]
}) {

  return render(
    <MockedApiContext value={{ deleteUser:props.deleteUser}}>
      <UserDeleteDialog
        user={props.user}
        onClose={props.onClose}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
      />
    </MockedApiContext>
  );
}

test("user delete works fine", async () => {
  const setIsOpenDelete = jest.fn();
  renderUserDeleteDialog({});

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
