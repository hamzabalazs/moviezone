import { fireEvent, render, screen } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import CategoryEditModal from "./CategoryEditModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderCategoryEditModal(setName: jest.Mock<any, any>) {
  const isOpenEdit = true;
  const name = "mockname";
  const categoryId = "idC2";
  return render(
    <MockedApiContext>
      <CategoryEditModal
        isOpenEdit={isOpenEdit}
        setIsOpenEdit={jest.fn()}
        name={name}
        setName={setName}
        categoryId={categoryId}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
      />
    </MockedApiContext>
  );
}

test("category edit works fine", async () => {
  const setName = jest.fn();
  renderCategoryEditModal(setName);

  const cardEditModal = screen.getByTestId("category-edit-modal");
  const cardEditModalButton = screen.getByRole("button", {
    name: "buttons.edit",
  }); // not tested
  const cardEditName = screen.getByTestId(
    "category-edit-modal-name"
  ) as HTMLInputElement;
  expect(cardEditName.value).toBe("mockname");
  fireEvent.change(cardEditName, { target: { value: "changeEditName" } });
  expect(cardEditName.value).toBe("changeEditName");
});
