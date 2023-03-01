import { fireEvent, render, screen } from "@testing-library/react";
import { CurrUser } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import UserCurrentEditModal from "./UserCurrentEditModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const adminUser: CurrUser = {
  id: "idU1",
  firstName: "admin",
  lastName: "admin",
  email: "admin@example.com",
  password: "admin",
  role: "admin",
  token: "token1",
};

function renderCurrentUserEditModal(
  setIsOpenEdit: jest.Mock<any, any>,
  setFirstName: jest.Mock<any, any>,
  setLastName: jest.Mock<any, any>,
  setEmail: jest.Mock<any, any>,
  setPassword: jest.Mock<any, any>,
  user?: CurrUser
) {
  const isOpenEdit = true;
  if (user) {
    const userId = user?.id;
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const email = user?.email;
    const password = user?.password;
    const role = user?.role;

    return render(
      <MockedApiContext>
        <UserCurrentEditModal
          isOpenEdit={isOpenEdit}
          setIsOpenEdit={setIsOpenEdit}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          setPassword={setPassword}
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
}

test("user current edit modal works fine", async () => {
  const setIsOpenEdit = jest.fn();
  const setFirstName = jest.fn();
  const setLastName = jest.fn();
  const setEmail = jest.fn();
  const setPassword = jest.fn();
  renderCurrentUserEditModal(
    setIsOpenEdit,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    adminUser
  );

  const cardEditModalButton = screen.getByRole("button", {
    name: "buttons.edit",
  }); // not tested
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

  expect(userFirstName.value).toBe("admin");
  expect(userLastName.value).toBe("admin");
  expect(userEmail.value).toBe("admin@example.com");
  expect(userPassword.value).toBe("admin");

  fireEvent.change(userFirstName, { target: { value: "changeFirstName" } });
  fireEvent.change(userLastName, { target: { value: "changeLastName" } });
  fireEvent.change(userEmail, { target: { value: "changeEmail" } });
  fireEvent.change(userPassword, { target: { value: "changePassword" } });

  expect(userFirstName.value).toBe("changeFirstName");
  expect(userLastName.value).toBe("changeLastName");
  expect(userEmail.value).toBe("changeEmail");
  expect(userPassword.value).toBe("changePassword");

  expect(setFirstName).toHaveBeenCalledTimes(1);
  expect(setLastName).toHaveBeenCalledTimes(1);
  expect(setEmail).toHaveBeenCalledTimes(1);
  expect(setPassword).toHaveBeenCalledTimes(1);
});
