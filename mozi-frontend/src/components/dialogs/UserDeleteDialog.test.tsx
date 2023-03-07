import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  password: "viewer",
  role: "viewer",
};

function renderUserDeleteDialog(props: {
  user?: User;
  onClose?: () => void;
  deleteUser?: UserData["deleteUser"];
}) {
  return render(
    <MockedApiContext value={{ deleteUser: props.deleteUser }}>
      <UserDeleteDialog
        user={props.user}
        onClose={props.onClose}
        setAlert={jest.fn()}
      />
    </MockedApiContext>
  );
}

test("If user is not provided should not open dialog", () => {
  const { queryByTestId } = renderUserDeleteDialog({});

  const dialog = queryByTestId("user-delete-dialog");

  expect(dialog).not.toBeInTheDocument();
});

test("If user is provided should show dialog correctly", () => {
  const { queryByTestId } = renderUserDeleteDialog({ user: testUser });

  const dialog = queryByTestId("user-delete-dialog");
  const acceptButton = queryByTestId("user-delete-dialog-accept");
  const quitButton = queryByTestId("user-delete-dialog-quit");

  expect(dialog).toBeInTheDocument();
  expect(acceptButton).toBeInTheDocument();
  expect(quitButton).toBeInTheDocument();
});

test("calls onClose if quitButton is clicked", async () => {
  const onCloseSpy = jest.fn();
  const { getByTestId } = renderUserDeleteDialog({
    user: testUser,
    onClose: onCloseSpy,
  });

  const quitButton = getByTestId("user-delete-dialog-quit")
  expect(onCloseSpy).not.toHaveBeenCalled()
  act(() => {
    userEvent.click(quitButton)
  })

  await waitFor(() => {
    expect(onCloseSpy).toHaveBeenCalled()
  })
});

test("calls deleteUser with correct values if acceptButton is clicked", async () => {
  const deleteUserSpy = jest.fn();
  const { getByTestId } = renderUserDeleteDialog({
    user: testUser,
    deleteUser: deleteUserSpy,
  });

  const acceptButton = getByTestId("user-delete-dialog-accept")
  expect(deleteUserSpy).not.toHaveBeenCalled()

  act(() => {
    userEvent.click(acceptButton)
  })

  await waitFor(() => {
    expect(deleteUserSpy).toHaveBeenCalledWith(testUser.id)
  })
});
