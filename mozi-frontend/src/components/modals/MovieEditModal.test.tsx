import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CurrUser } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import MovieEditModal from "./MovieEditModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderMovieEditModal(
  setIsOpenEdit: jest.Mock<any, any>,
  setTitle: jest.Mock<any, any>,
  setDescription: jest.Mock<any, any>,
  setReleaseDate: jest.Mock<any, any>,
  setCategoryId: jest.Mock<any, any>,
  user?: CurrUser
) {
  const isOpenEdit = true;
  const categoryId = "idC2";
  const movieId = "idM1";
  const poster = "mockPoster";
  const title = "mockTitle";
  const description = "mockDescription";
  const releaseDate = "25/04/2021";
  return render(
    <MockedApiContext value={{ user }}>
      {/* <MovieEditModal
        isOpenEdit={isOpenEdit}
        setIsOpenEdit={setIsOpenEdit}
        setTitle={setTitle}
        setDescription={setDescription}
        setReleaseDate={setReleaseDate}
        setCategoryId={setCategoryId}
        movieId={movieId}
        poster={poster}
        title={title}
        description={description}
        categoryId={categoryId}
        releaseDate={releaseDate}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
      /> */}
    </MockedApiContext>
  );
}

const adminUser: CurrUser = {
  id: "idU1",
  firstName: "admin",
  lastName: "admin",
  email: "admin@example.com",
  password: "admin",
  role: "admin",
  token: "token1",
};

test("movie edit works fine ( admin and editor only )", async () => {
  const setIsOpenEdit = jest.fn();
  const setTitle = jest.fn();
  const setDescription = jest.fn();
  const setReleaseDate = jest.fn();
  const setCategoryId = jest.fn();
  renderMovieEditModal(
    setIsOpenEdit,
    setTitle,
    setDescription,
    setReleaseDate,
    setCategoryId,
    adminUser
  );

  const modal = screen.getByTestId("movie-edit-modal");
  const editButton = screen.getByRole("button", {
    name: "buttons.edit",
  });
  const movieEditTitle = screen.getByTestId(
    "movie-edit-title"
  ) as HTMLInputElement;
  const movieEditDescription = screen.getByTestId(
    "movie-edit-description"
  ) as HTMLInputElement;
  const movieEditReleaseDate = screen.getByTestId(
    "movie-edit-releaseDate"
  ) as HTMLInputElement;
  const movieEditCategory = await screen.findByLabelText("movie.category");

  expect(movieEditTitle.value).toBe("mockTitle");
  expect(movieEditDescription.value).toBe("mockDescription");
  expect(movieEditReleaseDate.value).toBe("25/04/2021");
  expect(movieEditCategory).toBeInTheDocument();
  expect(movieEditCategory).toHaveTextContent("name2");

  const movieCategoryButton = screen.getByRole("button", {
    name: "movie.category",
  });

  fireEvent.change(movieEditTitle, { target: { value: "changeTitle" } });
  fireEvent.change(movieEditDescription, {
    target: { value: "changeDescription" },
  });
  fireEvent.change(movieEditReleaseDate, { target: { value: "12/03/1999" } });

  userEvent.click(movieEditCategory);
  const optionsPopup = await screen.findByRole("listbox", {
    name: "movie.category",
  });
  userEvent.click(within(optionsPopup).getByText("name3"));

  expect(movieEditTitle.value).toBe("changeTitle");
  expect(movieEditDescription.value).toBe("changeDescription");
  expect(movieEditReleaseDate.value).toBe("12/03/1999");
  
});
