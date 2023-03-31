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
import MovieAddModal from "./MovieAddModal";
import { v4 as uuidv4 } from "uuid";
import { SnackbarProvider } from "notistack";
import { CREATE_MOVIE } from "./movieQueries";
import { GET_CATEGORIES } from "../categories/categoryQueries";
import { MemoryRouter } from "react-router-dom";

const addMovie = {
  title: "title1",
  description: "description1",
  release_date: "22/02/2023",
  category_id: "idC1",
  poster: "chucknorris.jpg",
};

const dataMock = [
  {
    request: {
      query: GET_CATEGORIES,
    },
    result: {
      data: {
        getCategories: [
          {
            id: "idC1",
            name: "name1",
          },
          {
            id: "idC2",
            name: "name2",
          },
          {
            id: "idC3",
            name: "name3",
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_MOVIE,
      variables: {
        input: {
          title: addMovie.title,
          description: addMovie.description,
          poster: "",
          release_date: addMovie.release_date,
          category_id: addMovie.category_id,
        },
      },
    },
    result: {
      data: {
        createMovie: {
          id: uuidv4(),
          title: addMovie.title,
          description: addMovie.description,
          poster: "",
          release_date: addMovie.release_date,
          category: {
            id: addMovie.category_id,
            name: "name1",
          },
          rating: 0,
        },
      },
    },
  },
];

const cache = new InMemoryCache();

function renderMovieAddModal(props: {
  isOpenAdd: boolean;
  setIsOpenAdd?: () => void;
}) {
  return render(
    <MemoryRouter>
      <SnackbarProvider>
        <MockedProvider cache={cache} mocks={dataMock}>
          <MockedSessionContext>
            <MovieAddModal
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
  const { queryByTestId } = renderMovieAddModal({ isOpenAdd: false });

  const modal = queryByTestId("movie-add-modal");

  expect(modal).not.toBeInTheDocument();
});

test("If isOpenAdd is true, should show LoadingComponent while loading, after loading should not show", async () => {
  const { queryByTestId } = renderMovieAddModal({ isOpenAdd: true });

  const loader = queryByTestId("loader");
  expect(loader).toBeInTheDocument();

  await waitFor(() => {
    expect(loader).not.toBeInTheDocument();
  });
});

test("If isOpenAdd is true should show modal correctly", async () => {
  const { queryByTestId, findByTestId } = renderMovieAddModal({
    isOpenAdd: true,
  });

  const modal = await findByTestId("movie-add-modal");
  const title = await findByTestId("movie-add-title");
  const description = queryByTestId("movie-add-description");
  const release_date = queryByTestId("movie-add-release_date");
  const category = queryByTestId("movie-add-category");
  const poster = queryByTestId("movie-add-poster");
  const addButton = queryByTestId("movie-add");

  expect(modal).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(title).toHaveValue("");
  expect(description).toBeInTheDocument();
  expect(description).toHaveValue("");
  expect(release_date).toBeInTheDocument();
  expect(release_date).toHaveValue("");
  expect(category).toBeInTheDocument();
  expect(category).toHaveValue("");
  expect(poster).toBeInTheDocument();
  expect(poster).toHaveValue("");
  expect(addButton).toBeInTheDocument();
});

test("calls addMovie with correct values when addButton is clicked", async () => {
  const { getByTestId, findByTestId } = renderMovieAddModal({
    isOpenAdd: true,
  });
  const file = new File(["test"], "chucknorris.jpg", { type: "image/jpg" });

  const title = (await findByTestId("movie-add-title")) as HTMLInputElement;
  const description = getByTestId("movie-add-description") as HTMLInputElement;
  const release_date = getByTestId(
    "movie-add-release_date"
  ) as HTMLInputElement;
  const category = getByTestId("movie-add-category") as HTMLInputElement;
  const poster = getByTestId("movie-add-poster") as HTMLInputElement;
  const addButton = getByTestId("movie-add") as HTMLInputElement;
  expect(screen.queryByText("Success")).not.toBeInTheDocument();

  fireEvent.change(title, { target: { value: addMovie.title } });
  fireEvent.change(description, { target: { value: addMovie.description } });
  fireEvent.change(release_date, { target: { value: addMovie.release_date } });
  fireEvent.change(category, { target: { value: addMovie.category_id } });
  fireEvent.change(poster, { target: { files: [file] } });

  act(() => {
    userEvent.click(addButton);
  });

  await waitFor(() => {
    expect(screen.queryByText("successMessages.movieAdd")).toBeInTheDocument();
  });
});
