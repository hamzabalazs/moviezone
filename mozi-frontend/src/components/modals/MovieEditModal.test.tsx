import { gql, InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import MovieEditModal from "./MovieEditModal";
import { SnackbarProvider } from "notistack";
import { GET_CATEGORIES } from "../../pages/useCategoriesData";
import { UPDATE_MOVIE } from "../../api/movie/useMovie";
import { Movie} from "../../gql/graphql";

const testMovie: Movie = {
  id: "idM1",
  title: "title1",
  description: "description1",
  release_date: "22/02/2023",
  poster: "poster1",
  category: {
    id: "idC1",
    name: "name1",
  },
  rating: "3",
};

const testNewMovie = {
  id: "idM1",
  title: "titleEDITED",
  description: "descriptionEDITED",
  release_date: "03/03/2023",
  poster: "poster1",
  categoryId: "idC3",
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
      query: UPDATE_MOVIE,
      variables: {
        input: {
          id: testMovie.id,
          title: testNewMovie.title,
          description: testNewMovie.description,
          poster: testMovie.poster,
          release_date: testNewMovie.release_date,
          category_id: testNewMovie.categoryId,
        },
      },
    },
    result: {
      data: {
        updateMovie: {
          id: testMovie.id,
          title: testNewMovie.title,
          description: testNewMovie.description,
          poster: testMovie.poster,
          release_date: testNewMovie.release_date,
          category: {
            id: testNewMovie.categoryId,
            name: "name3",
          },
          rating: testMovie.rating,
        },
      },
    },
  },
];

const cache = new InMemoryCache()

function renderMovieEditModal(props: { movie?: Movie; onClose?: () => void }) {
  return render(
    <SnackbarProvider autoHideDuration={null}>
      <MockedProvider mocks={dataMock} cache={cache}>
        <MockedSessionContext>
          <MovieEditModal movie={props.movie} onClose={props.onClose} />
        </MockedSessionContext>
      </MockedProvider>
    </SnackbarProvider>
  );
}

test("If movie is not provided should not open modal", () => {
  const { queryByTestId } = renderMovieEditModal({});

  const modal = queryByTestId("movie-edit-modal");

  expect(modal).not.toBeInTheDocument();
});

test("If movie is provided should open modal with correct values", async () => {
  const { queryByTestId, getByTestId, findByTestId } = renderMovieEditModal({
    movie: testMovie,
  });

  const modal = await findByTestId("movie-edit-modal");
  const title = await findByTestId("movie-edit-title");
  const description = queryByTestId("movie-edit-description");
  const release_date = queryByTestId("movie-edit-release_date");
  const categoryId = getByTestId("movie-edit-categoryId");

  expect(modal).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(title).toHaveValue(testMovie.title);
  expect(description).toBeInTheDocument();
  expect(description).toHaveValue(testMovie.description);
  expect(release_date).toBeInTheDocument();
  expect(release_date).toHaveValue(testMovie.release_date);
  expect(categoryId).toBeInTheDocument();
  expect(categoryId).toHaveValue(testMovie.category.id);
});

test("calls edit movie successfully", async () => {
  const { getByTestId, getByRole, queryByText, findByTestId } =
    renderMovieEditModal({
      movie: testMovie,
    });

  const title = await findByTestId("movie-edit-title");
  const description = getByTestId("movie-edit-description");
  const release_date = getByTestId("movie-edit-release_date");
  const editButton = getByTestId("movie-edit-button");
  const category = within(getByTestId("movie-edit-category"));
  expect(queryByText("Success")).not.toBeInTheDocument();

  fireEvent.change(title, { target: { value: testNewMovie.title } });
  fireEvent.change(description, {
    target: { value: testNewMovie.description },
  });
  fireEvent.change(release_date, {
    target: { value: testNewMovie.release_date },
  });

  fireEvent.mouseDown(category.getByRole("button"));
  const listbox = within(getByRole("listbox"));
  const role = listbox.getAllByRole("option").find((x) => x.getAttribute("data-value") === testNewMovie.categoryId)!
  userEvent.click(role);

  act(() => {
    userEvent.click(editButton);
  });

  await waitFor(() => {
    expect(queryByText("successMessages.movieEdit")).toBeInTheDocument();
  });
});
