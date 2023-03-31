import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import CategoryAddModal from "./CategoryAddModal";
import { v4 as uuidv4 } from "uuid";
import { SnackbarProvider } from "notistack";
import { CREATE_CATEGORY } from "./categoryQueries";
import { MemoryRouter } from "react-router-dom";
const addCategory = {
  name: "ADDED",
};

const addMock = {
  request: {
    query: CREATE_CATEGORY,
    variables: {
      input: {
        name: addCategory.name,
      },
    },
  },
  result: {
    data: {
      createCategory: {
        id: uuidv4(),
        name: addCategory.name,
      },
    },
  },
};

const cache = new InMemoryCache();

function renderCategoryAddModal(props: {
  isOpenAdd: boolean;
  setIsOpenAdd?: () => void;
}) {
  return render(
    <MemoryRouter>
      <SnackbarProvider autoHideDuration={null}>
        <MockedProvider cache={cache} mocks={[addMock]}>
          <MockedSessionContext>
            <CategoryAddModal
              isOpenAdd={props.isOpenAdd}
              setIsOpenAdd={props.setIsOpenAdd}
            />
          </MockedSessionContext>
        </MockedProvider>
      </SnackbarProvider>
    </MemoryRouter>
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
  const addButton = queryByTestId("category-add");

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
  const addButton = getByTestId("category-add");
  expect(screen.queryByText("Success")).not.toBeInTheDocument();

  fireEvent.change(name, { target: { value: addCategory.name } });

  act(() => {
    userEvent.click(addButton);
  });

  await waitFor(() => {
    expect(
      screen.queryByText("successMessages.categoryAdd")
    ).toBeInTheDocument();
  });
});
