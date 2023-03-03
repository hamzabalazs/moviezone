import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MovieData } from "../../api/movie/useMovies";
import { Movie } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import MovieEditModal from "./MovieEditModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const testMovie: Movie = {
  id: "idM1",
  title: "title1",
  description: "description1",
  releaseDate: "22/02/2023",
  poster: "poster1",
  categoryId: "idC1",
  rating: 3.5,
};

const testNewMovie = {
  id: "idM1",
  title: "titleEDITED",
  description: "descriptionEDITED",
  releaseDate: "03/03/2023",
  poster: "poster1",
  categoryId: "idC3",
};

function renderMovieEditModal(props: {
  movie?: Movie;
  onClose?: () => void;
  editMovie?: MovieData["editMovie"];
}) {
  return render(
    <MockedApiContext value={{ editMovie: props.editMovie }}>
      <MovieEditModal movie={props.movie} onClose={props.onClose} />
    </MockedApiContext>
  );
}

test("If movie is not provided should not open modal", () => {
  const { queryByTestId } = renderMovieEditModal({});

  const modal = queryByTestId("movie-edit-modal");

  expect(modal).not.toBeInTheDocument();
});

test("If movie is provided should open modal with correct values", () => {
  const { queryByTestId,getByTestId } = renderMovieEditModal({ movie: testMovie });

  const modal = queryByTestId("movie-edit-modal");
  const title = queryByTestId("movie-edit-title");
  const description = queryByTestId("movie-edit-description");
  const releaseDate = queryByTestId("movie-edit-releaseDate");
  const categoryId = getByTestId("movie-edit-categoryId");

  expect(modal).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(title).toHaveValue(testMovie.title);
  expect(description).toBeInTheDocument();
  expect(description).toHaveValue(testMovie.description);
  expect(releaseDate).toBeInTheDocument();
  expect(releaseDate).toHaveValue(testMovie.releaseDate);
  expect(categoryId).toBeInTheDocument();
  expect(categoryId).toHaveValue(testMovie.categoryId);
});

test("calls editMovie with correct values", async () => {
  const editMovieSpy = jest.fn();
  const { getByTestId, getByRole } = renderMovieEditModal({
    movie: testMovie,
    editMovie: editMovieSpy,
  });

  const title = getByTestId("movie-edit-title");
  const description = getByTestId("movie-edit-description");
  const releaseDate = getByTestId("movie-edit-releaseDate");
  const editButton = getByTestId("movie-edit-button");
  const category = within(getByTestId("movie-edit-category"));

  fireEvent.change(title, { target: { value: testNewMovie.title } });
  fireEvent.change(description, {
    target: { value: testNewMovie.description },
  });
  fireEvent.change(releaseDate, {
    target: { value: testNewMovie.releaseDate },
  });

  fireEvent.mouseDown(category.getByRole("button"));
  const listbox = within(getByRole("listbox"));
  fireEvent.click(
    listbox
      .getAllByRole("option")
      .find((x) => x.getAttribute("data-value") === testNewMovie.categoryId)!
  );

  act(() => {
    userEvent.click(editButton);
  });

  await waitFor(() => {
    expect(editMovieSpy).toHaveBeenCalledWith(testNewMovie);
  });
});
