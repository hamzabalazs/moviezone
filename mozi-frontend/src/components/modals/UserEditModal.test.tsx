import { fireEvent, render, screen } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import UserEditModal from "./UserEditModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderUserEditModal(
  setIsOpenEdit: jest.Mock<any, any>,
  setFirstName: jest.Mock<any, any>,
  setLastName: jest.Mock<any, any>,
  setEmail: jest.Mock<any, any>,
  setPassword: jest.Mock<any, any>,
  setRole: jest.Mock<any, any>
) {
  const isOpenEdit = true;
  const userId = "idU3";
  const firstName = "viewer";
  const lastName = "viewer";
  const email = "viewer@example.com";
  const password = "viewer";
  const role = "viewer";

  return render(
    <MockedApiContext>
      <UserEditModal
        isOpenEdit={isOpenEdit}
        setIsOpenEdit={setIsOpenEdit}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
        setPassword={setPassword}
        setRole={setRole}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
        userId={userId}
        firstName={firstName}
        lastName={lastName}
        email={email}
        password={password}
        role={role}
      />
    </MockedApiContext>
  );
}

test("user edit modal works fine", () => {
  const setIsOpenEdit = jest.fn();
  const setFirstName = jest.fn();
  const setLastName = jest.fn();
  const setEmail = jest.fn();
  const setPassword = jest.fn();
  const setRole = jest.fn();
  renderUserEditModal(
    setIsOpenEdit,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setRole
  );

  const userFirstName = screen.getByTestId(
    "user-edit-modal-firstName"
  ) as HTMLInputElement;
  const userLastName = screen.getByTestId(
    "user-edit-modal-lastName"
  ) as HTMLInputElement;
  const userEmail = screen.getByTestId(
    "user-edit-modal-email"
  ) as HTMLInputElement;
  const userPassword = screen.getByTestId(
    "user-edit-modal-password"
  ) as HTMLInputElement;
  const userRole = screen.getByTestId(
    "user-edit-modal-role"
  ) as HTMLInputElement;

  expect(userFirstName.value).toBe("viewer");
  expect(userLastName.value).toBe("viewer");
  expect(userEmail.value).toBe("viewer@example.com");
  expect(userPassword.value).toBe("viewer");
  expect(userRole.value).toBe("viewer");

  fireEvent.change(userFirstName, { target: { value: "changeFirstName" } });
  fireEvent.change(userLastName, { target: { value: "changeLastName" } });
  fireEvent.change(userEmail, { target: { value: "changeEmail" } });
  fireEvent.change(userPassword, { target: { value: "changePassword" } });
  fireEvent.change(userRole, { target: { value: "editor" } });

  expect(userFirstName.value).toBe("changeFirstName");
  expect(userLastName.value).toBe("changeLastName");
  expect(userEmail.value).toBe("changeEmail");
  expect(userPassword.value).toBe("changePassword");
  expect(userRole.value).toBe("editor");
});
