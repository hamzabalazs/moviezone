import { act, fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import CategoryAddModal from "./CategoryAddModal";


const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const addCategory = {
  name: "ADDED"
};

function renderCategoryAddModal(props:{
  isOpenAdd: boolean;
  setIsOpenAdd?: () => void;
}) {
  return render(
    <MockedSessionContext>
      <CategoryAddModal
        isOpenAdd={props.isOpenAdd}
        setIsOpenAdd={props.setIsOpenAdd}
      />
    </MockedSessionContext>
  );
}

test("If isOpenAdd is false should not open modal",() => {
  const {queryByTestId} = renderCategoryAddModal({isOpenAdd:false})

  const modal = queryByTestId("category-add-modal")

  expect(modal).not.toBeInTheDocument()
})

test("If isOpenAdd is true should show modal correctly",() => {
  const {queryByTestId} = renderCategoryAddModal({isOpenAdd:true})

  const modal = queryByTestId("category-add-modal")
  const name = queryByTestId("category-add-name")
  const addButton = queryByTestId("category-add-button")

  expect(modal).toBeInTheDocument()
  expect(name).toBeInTheDocument()
  expect(name).toHaveValue("")
  expect(addButton).toBeInTheDocument()
})

// test("calls addCategory with correct values when addButton is clicked", async() => {
//   const addCategorySpy = jest.fn()
//   const {getByTestId} = renderCategoryAddModal({isOpenAdd:true,addCategory:addCategorySpy})

//   const name = getByTestId("category-add-name")
//   const addButton = getByTestId("category-add-button")

//   fireEvent.change(name,{target:{value:addCategory.name}})
  
//   act(() => {
//     userEvent.click(addButton)
//   })

//   await waitFor(() => {
//     expect(addCategorySpy).toHaveBeenCalledWith(addCategory)
//   })

// })




