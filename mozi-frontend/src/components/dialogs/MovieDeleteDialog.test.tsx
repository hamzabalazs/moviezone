import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { Movie, MovieWithReviews } from "../../api/types";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import MovieDeleteDialog from "./MovieDeleteDialog";
import { SnackbarProvider } from "notistack";

const testMovie: MovieWithReviews = {
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
  reviews:[]
};

const DELETE_MOVIE = gql`
  mutation DeleteMovie($input: DeleteMovieInput!) {
    deleteMovie(input: $input) {
      id
      title
      description
      poster
      release_date
      category {
        id
        name
      }
      rating
    }
  }
`;

const deleteMock = {
  request: {
    query: DELETE_MOVIE,
    variables: {
      input: {
        id: testMovie.id,
      },
    },
  },
  result: {
    data: {
      deleteMovie: {
        id: testMovie.id,
        title: testMovie.title,
        description: testMovie.description,
        poster: testMovie.poster,
        release_date: testMovie.release_date,
        category: {
          id: testMovie.category.id,
          name: testMovie.category.name,
        },
        rating: testMovie.rating,
      },
    },
  },
};

function renderMovieDeleteDialog(props: {
  movie?: MovieWithReviews;
  onClose?: () => void;
}) {
  return render(
    <MemoryRouter>
      <SnackbarProvider autoHideDuration={null}>
        <MockedProvider addTypename={false} mocks={[deleteMock]}>
          <MockedSessionContext>
            <MovieDeleteDialog movie={props.movie} onClose={props.onClose} />
          </MockedSessionContext>
        </MockedProvider>
      </SnackbarProvider>
    </MemoryRouter>
  );
}

test("If movie is not provided should not open dialog", () => {
  const { queryByTestId } = renderMovieDeleteDialog({});

  const dialog = queryByTestId("movie-delete-dialog");

  expect(dialog).not.toBeInTheDocument();
});

test("If movie is provided should show dialog correctly", () => {
  const { queryByTestId } = renderMovieDeleteDialog({ movie: testMovie });

  const dialog = queryByTestId("movie-delete-dialog");
  const acceptButton = queryByTestId("movie-delete-accept");
  const quitButton = queryByTestId("movie-delete-quit");

  expect(dialog).toBeInTheDocument();
  expect(acceptButton).toBeInTheDocument();
  expect(quitButton).toBeInTheDocument();
});

test("calls onClose when quitButton is clicked", async () => {
  const onCloseSpy = jest.fn();
  const { getByTestId } = renderMovieDeleteDialog({
    movie: testMovie,
    onClose: onCloseSpy,
  });

  const quitButton = getByTestId("movie-delete-quit");
  expect(onCloseSpy).not.toHaveBeenCalled();

  act(() => {
    userEvent.click(quitButton);
  });

  await waitFor(() => {
    expect(onCloseSpy).toHaveBeenCalled();
  });
});

test("Should call delete movie successfully", async () => {
  const { getByTestId } = renderMovieDeleteDialog({ movie: testMovie });

  const acceptButton = getByTestId("movie-delete-accept");

  act(() => {
    userEvent.click(acceptButton);
  });

  await waitFor(() => {
    expect(screen.getByText("successMessages.movieDelete")).toBeInTheDocument();
  });
});
