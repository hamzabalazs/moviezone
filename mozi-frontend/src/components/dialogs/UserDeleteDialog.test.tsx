import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { User } from "../../api/types";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import UserDeleteDialog from "./UserDeleteDialog";

const testUser: User = {
  id: "idU3",
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  password: "viewer",
  role: "viewer",
};

const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;

const deleteMock = {
  request: {
    query: DELETE_USER,
    variables: {
      input: {
        id: testUser.id,
      },
    },
  },
  result: {
    data: {
      deleteUser: {
        id: testUser.id,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        role: testUser.role,
        email: testUser.email,
      },
    },
  },
};

function renderUserDeleteDialog(props: { user?: User; onClose?: () => void }) {
  return render(
    <MockedProvider addTypename={false} mocks={[deleteMock]}>
      <MockedSessionContext>
        <UserDeleteDialog
          user={props.user}
          onClose={props.onClose}
        />
      </MockedSessionContext>
    </MockedProvider>
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

  const quitButton = getByTestId("user-delete-dialog-quit");
  expect(onCloseSpy).not.toHaveBeenCalled();
  act(() => {
    userEvent.click(quitButton);
  });

  await waitFor(() => {
    expect(onCloseSpy).toHaveBeenCalled();
  });
});

test("Should call user delete successfully", async () => {
  const { getByTestId } = renderUserDeleteDialog({
    user: testUser,
  });

  const acceptButton = getByTestId("user-delete-dialog-accept");
  expect(screen.queryByText("Success")).not.toBeInTheDocument();

  act(() => {
    userEvent.click(acceptButton);
  });

  await waitFor(() => {
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
  });
});
