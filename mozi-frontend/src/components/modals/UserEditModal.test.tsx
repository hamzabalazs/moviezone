import { gql, InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import UserEditModal from "./UserEditModal";
import { SnackbarProvider } from "notistack";
import { UPDATE_USER } from "../../api/user/useUser";
import { FullUser, UserRole } from "../../gql/graphql";

const testUser: FullUser = {
  id: "idU3",
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  password: "viewer",
  role: UserRole["Viewer"],
};

const newTestUser: FullUser = {
  id: "idU3",
  first_name: "New viewer",
  last_name: "New viewer",
  email: "new_viewer@example.com",
  password: "New viewer",
  role: UserRole["Viewer"],
};


const editMock = {
  request: {
    query: UPDATE_USER,
    variables: {
      input: {
        id: testUser.id,
        first_name: newTestUser.first_name,
        last_name: newTestUser.last_name,
        email: newTestUser.email,
        password: newTestUser.password,
        role: newTestUser.role,
      },
    },
  },
  result: {
    data: {
      updateUser: {
        id: testUser.id,
        first_name: newTestUser.first_name,
        last_name: newTestUser.last_name,
        role: newTestUser.role,
        email: newTestUser.email,
      },
    },
  },
};

const cache = new InMemoryCache()

function renderUserEditModal(props: {
  user?: FullUser;
  onClose?: () => void;
  allowEditRole?: boolean;
}) {
  return render(
    <SnackbarProvider autoHideDuration={null}>
      <MockedProvider mocks={[editMock]} cache={cache}>
        <MockedSessionContext>
          <UserEditModal
            user={props.user}
            onClose={props.onClose}
            allowEditRole={props.allowEditRole}
          />
        </MockedSessionContext>
      </MockedProvider>
    </SnackbarProvider>
  );
}

test("If user is not provided should not open", () => {
  const { queryByTestId } = renderUserEditModal({});

  const modal = queryByTestId("user-edit-modal");

  expect(modal).not.toBeInTheDocument();
});

test("If user is provided should show open modal with correct values", () => {
  const { queryByTestId } = renderUserEditModal({ user: testUser });

  const modal = queryByTestId("user-edit-modal");
  const first_name = queryByTestId("user-edit-modal-first_name");
  const last_name = queryByTestId("user-edit-modal-last_name");
  const email = queryByTestId("user-edit-modal-email");
  const password = queryByTestId("user-edit-modal-password");
  const role = queryByTestId("user-edit-modal-role");
  const submit = queryByTestId("user-edit-modal-submit");

  expect(modal).toBeInTheDocument();
  expect(first_name).toBeInTheDocument();
  expect(first_name).toHaveValue(testUser.first_name);
  expect(last_name).toBeInTheDocument();
  expect(last_name).toHaveValue(testUser.last_name);
  expect(email).toBeInTheDocument();
  expect(email).toHaveValue(testUser.email);
  expect(password).toBeInTheDocument();
  expect(role).not.toBeInTheDocument();
  expect(submit).toBeInTheDocument();
});

test("If allowEditRole is set should show role selector", () => {
  const { queryByTestId } = renderUserEditModal({
    user: testUser,
    allowEditRole: true,
  });

  const role = queryByTestId("user-edit-modal-role");

  expect(role).toBeInTheDocument();
});

test("Should call edit user successfully", async () => {
  const { getByTestId, getByRole, queryByText } = renderUserEditModal({
    user: testUser,
    allowEditRole: true,
  });

  const first_name = getByTestId("user-edit-modal-first_name");
  const last_name = getByTestId("user-edit-modal-last_name");
  const email = getByTestId("user-edit-modal-email");
  const password = getByTestId("user-edit-modal-password");
  const role = within(getByTestId("user-edit-modal-role"));
  const submit = getByTestId("user-edit-modal-submit");
  expect(queryByText("Success")).not.toBeInTheDocument();

  fireEvent.change(first_name, { target: { value: newTestUser.first_name } });
  fireEvent.change(last_name, { target: { value: newTestUser.last_name } });
  fireEvent.change(email, { target: { value: newTestUser.email } });
  fireEvent.change(password, { target: { value: newTestUser.password } });
  fireEvent.mouseDown(role.getByRole("button"));
  const listbox = within(getByRole("listbox"));
  userEvent.click(
    listbox
      .getAllByRole("option")
      .find((x) => x.getAttribute("data-value") === newTestUser.role)!
  );

  act(() => {
    userEvent.click(submit);
  });

  await waitFor(() => {
    expect(queryByText("successMessages.userEdit")).toBeInTheDocument();
  });
});
