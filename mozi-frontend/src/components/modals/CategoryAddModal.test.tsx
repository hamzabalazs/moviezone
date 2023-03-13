import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import CategoryAddModal from "./CategoryAddModal";
import { v4 as uuidv4 } from "uuid";

const addCategory = {
  name: "ADDED",
};

const ADD_CATEGORY = gql`
  mutation CreateCategory($input: AddCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

const addMock = {
  request:{
    query:ADD_CATEGORY,
    variables:{
      input:{
        name: addCategory.name
      }
    }
  },
  result:{
    data:{
      createCategory:{
        id: uuidv4(),
        name: addCategory.name
      }
    }
  }
}

function renderCategoryAddModal(props: {
  isOpenAdd: boolean;
  setIsOpenAdd?: () => void;
}) {
  return render(
    <MockedProvider addTypename={false} mocks={[addMock]}>
      <MockedSessionContext>
        <CategoryAddModal
          isOpenAdd={props.isOpenAdd}
          setIsOpenAdd={props.setIsOpenAdd}
        />
      </MockedSessionContext>
    </MockedProvider>
  );
}

test("If isOpenAdd is false should not open modal", () => {
  const { queryByTestId } = renderCategoryAddModal({ isOpenAdd: false });

  const modal = queryByTestId("category-add-modal");

  expect(modal).not.toBeInTheDocument();
});

test("If isOpenAdd is true should show modal correctly", () => {
  const { queryByTestId } = renderCategoryAddModal({ isOpenAdd: true });

  const modal = queryByTestId("category-add-modal");
  const name = queryByTestId("category-add-name");
  const addButton = queryByTestId("category-add-button");

  expect(modal).toBeInTheDocument();
  expect(name).toBeInTheDocument();
  expect(name).toHaveValue("");
  expect(addButton).toBeInTheDocument();
});

test("calls add category successfully", async () => {
  const { getByTestId } = renderCategoryAddModal({
    isOpenAdd: true,
  });

  const name = getByTestId("category-add-name");
  const addButton = getByTestId("category-add-button");
  expect(screen.queryByText("Success")).not.toBeInTheDocument()


  fireEvent.change(name, { target: { value: addCategory.name } });

  act(() => {
    userEvent.click(addButton);
  });

  await waitFor(() => {
    expect(screen.queryByText("Success")).toBeInTheDocument()
  });
});
