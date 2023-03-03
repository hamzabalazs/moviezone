import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { User } from "../../api/types";
import { UserData } from "../../api/user/useUsers";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import UserEditModal from "./UserEditModal";

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

const newTestUser: User = {
  id: "idU3",
  firstName: "New viewer",
  lastName: "New viewer",
  email: "new_viewer@example.com",
  password: "New viewer",
  role: "editor",
};

function renderUserEditModal(props: {
  user?: User;
  onClose?: () => void;
  allowEditRole?: boolean;
  editUser?: UserData["editUser"];
}) {
  return render(
    <MockedApiContext value={{ editUser: props.editUser }}>
      <UserEditModal
        user={props.user}
        onClose={props.onClose}
        allowEditRole={props.allowEditRole}
        setAlert={jest.fn()}
      />
    </MockedApiContext>
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
  const firstName = queryByTestId("user-edit-modal-firstName");
  const lastName = queryByTestId("user-edit-modal-lastName");
  const email = queryByTestId("user-edit-modal-email");
  const password = queryByTestId("user-edit-modal-password");
  const role = queryByTestId("user-edit-modal-role");
  const submit = queryByTestId("user-edit-modal-submit");

  expect(modal).toBeInTheDocument();
  expect(firstName).toBeInTheDocument();
  expect(firstName).toHaveValue(testUser.firstName);
  expect(lastName).toBeInTheDocument();
  expect(lastName).toHaveValue(testUser.lastName);
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

test("Should call editUser with correct values", async () => {
  const editUserSpy = jest.fn();
  const { getByTestId, getByRole } = renderUserEditModal({
    user: testUser,
    allowEditRole: true,
    editUser: editUserSpy,
  });

  const firstName = getByTestId("user-edit-modal-firstName");
  const lastName = getByTestId("user-edit-modal-lastName");
  const email = getByTestId("user-edit-modal-email");
  const password = getByTestId("user-edit-modal-password");
  const role = within(getByTestId("user-edit-modal-role"));
  const submit = getByTestId("user-edit-modal-submit");

  fireEvent.change(firstName, { target: { value: newTestUser.firstName } });
  fireEvent.change(lastName, { target: { value: newTestUser.lastName } });
  fireEvent.change(email, { target: { value: newTestUser.email } });
  fireEvent.change(password, { target: { value: newTestUser.password } });
  fireEvent.mouseDown(role.getByRole("button"));
  const listbox = within(getByRole("listbox"));
  fireEvent.click(
    listbox
      .getAllByRole("option")
      .find((x) => x.getAttribute("data-value") === newTestUser.role)!
  );

  act(() => {
    userEvent.click(submit);
  });

  await waitFor(() => {
    expect(editUserSpy).toHaveBeenCalledWith(newTestUser);
  });
});

test("If allowEditRole not set should call editUser without role", async () => {
  const editUserSpy = jest.fn();
  const { getByTestId } = renderUserEditModal({
    user: testUser,
    editUser: editUserSpy,
  });

  const submit = getByTestId("user-edit-modal-submit");

  act(() => {
    userEvent.click(submit);
  });

  await waitFor(() => {
    expect(editUserSpy).toHaveBeenCalledWith({ ...testUser, role: undefined });
  });
});
