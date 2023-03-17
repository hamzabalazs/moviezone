import { gql, InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { CurrUser } from "../api/types";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import MoviePage from "./MoviePage";

const GET_MOVIE_BY_ID = gql`
  query GetMovieById($input: MovieInput!) {
    getMovieById(input: $input) {
      id
      title
      poster
      description
      release_date
      rating
      category {
        id
        name
      }
    }
  }
`;

const GET_REVIEWS_OF_MOVIE = gql`
  query GetReviewsOfMovie($input: GetReviewsOfMovieInput!) {
    getReviewsOfMovie(input: $input) {
      id
      rating
      description
      movie {
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
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

const GET_USERS_REVIEWS_OF_MOVIE = gql`
  query GetReviewsOfUserForMovie($input: GetReviewsOfUserForMovieInput!) {
    getReviewsOfUserForMovie(input: $input) {
      id
      rating
      description
      movie {
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
      user {
        first_name
        last_name
        id
      }
    }
  }
`;

const mockMovieData = [
  {
    request: {
      query: GET_MOVIE_BY_ID,
      variables: {
        input: {
          id: "idM4",
        },
      },
    },
    result: {
      data: {
        getMovieById: {
          id: "idM4",
          title: "title4",
          poster: "poster4",
          description: "description4",
          release_date: "04/04/2024",
          rating: "4",
          category: {
            id: "idC1",
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_USERS_REVIEWS_OF_MOVIE,
      variables: {
        input: {
          movie_id: "idM4",
          user_id: "idU1",
        },
      },
    },
    result: {
      data: {
        getReviewsOfUserForMovie: [
          {
            id: "idR3",
            rating: "3",
            description: "Good!",
            movie: {
              title: "title4",
              id: "idM4",
            },
            user: {
              id: "idU1",
              first_name: "admin",
              last_name: "admin",
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_REVIEWS_OF_MOVIE,
      variables: {
        input: {
          movie_id: "idM4",
        },
      },
    },
    result: {
      data: {
        getReviewsOfMovie: [
          {
            id: "idR3",
            rating: "3",
            description: "Good!",
            movie: {
              title: "title4",
              id: "idM4",
            },
            user: {
              id: "idU1",
              first_name: "admin",
              last_name: "admin",
            },
          },
          {
            id: "idR4",
            rating: "1",
            description: "Bad!",
            movie: {
              title: "title4",
              id: "idM4",
            },
            user: {
              id: "idU3",
              first_name: "viewer",
              last_name: "viewer",
            },
          },
        ],
      },
    },
  },
];

const mockMovieDataViewer = [
  {
    request: {
      query: GET_MOVIE_BY_ID,
      variables: {
        input: {
          id: "idM4",
        },
      },
    },
    result: {
      data: {
        getMovieById: {
          id: "idM4",
          title: "title4",
          poster: "poster4",
          description: "description4",
          release_date: "04/04/2024",
          rating: "4",
          category: {
            id: "idC1",
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_USERS_REVIEWS_OF_MOVIE,
      variables: {
        input: {
          movie_id: "idM4",
          user_id: "idU3",
        },
      },
    },
    result: {
      data: {
        getReviewsOfUserForMovie: [
          {
            id: "idR4",
            rating: "1",
            description: "Bad!",
            movie: {
              title: "title4",
              id: "idM4",
            },
            user: {
              id: "idU3",
              first_name: "viewer",
              last_name: "viewer",
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_REVIEWS_OF_MOVIE,
      variables: {
        input: {
          movie_id: "idM4",
        },
      },
    },
    result: {
      data: {
        getReviewsOfMovie: [
          {
            id: "idR3",
            rating: "3",
            description: "Good!",
            movie: {
              title: "title4",
              id: "idM4",
            },
            user: {
              id: "idU1",
              first_name: "admin",
              last_name: "admin",
            },
          },
          {
            id: "idR4",
            rating: "1",
            description: "Bad!",
            movie: {
              title: "title4",
              id: "idM4",
            },
            user: {
              id: "idU3",
              first_name: "viewer",
              last_name: "viewer",
            },
          },
        ],
      },
    },
  },
]

const adminUser: CurrUser = {
  id: "idU1",
  first_name: "admin",
  last_name: "admin",
  email: "admin@example.com",
  password: "admin",
  role: "admin",
  token: "token1",
};

const viewerUser: CurrUser = {
  id: "idU3",
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  password: "viewer",
  role: "viewer",
  token: "token1",
};

const cache = new InMemoryCache();

function renderMoviePage(currUser?: CurrUser,mockData?:any) {
  const FAKE_EVENT = { name: "test event" };
  const routes = [
    {
      path: "movie/:currmovie_id",
      element: <MoviePage />,
      loader: () => FAKE_EVENT,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/", "/movie/idM4"],
    initialIndex: 1,
  });

  return render(
    <MockedSessionContext value={{ user: currUser }}>
      <MockedProvider cache={cache} mocks={mockData}>
        <RouterProvider router={router} />
      </MockedProvider>
    </MockedSessionContext>
  );
}

test("Should not have edit and delete button on moviecard if current user is viewer", async () => {
  renderMoviePage(viewerUser,mockMovieDataViewer);

  const card = await screen.findByTestId("moviepage-card");
  const movieEditButton = screen.queryByTestId("moviepage-edit-button");
  const movieDeleteButton = screen.queryByTestId("moviepage-delete-button");
  expect(movieDeleteButton).not.toBeInTheDocument();
  expect(movieEditButton).not.toBeInTheDocument();
});

test("Should have edit and delete button on reviewcard where user is viewer and has review on movie", async () => {
  renderMoviePage(viewerUser,mockMovieDataViewer);

  const reviewCard = await screen.findAllByTestId("review-card");
  const reviewEditButtons = screen.queryAllByTestId("review-edit-button");
  const reviewDeleteButtons = screen.getAllByTestId("review-delete-button");

  expect(reviewCard).toHaveLength(2);
  expect(reviewEditButtons).toBeTruthy();
  expect(reviewDeleteButtons).toBeTruthy();
  expect(reviewEditButtons).toHaveLength(1);
  expect(reviewDeleteButtons).toHaveLength(1);
});

test("movie has correct amount of reviews", async () => {
  renderMoviePage(adminUser,mockMovieData);

  const reviewCard = await screen.findAllByTestId("review-card");
  expect(reviewCard).toHaveLength(2);
});

test("admin/editor should have edit and delete button for movies/reviews", async () => {
  renderMoviePage(adminUser,mockMovieData);
  const card = await screen.findByTestId("moviepage-card");
  const cardCount = screen.getAllByTestId("moviepage-card");
  const movieEditButton = screen.getByTestId("moviepage-edit-button");
  const movieDeleteButton = screen.getByTestId("moviepage-delete-button");
  const reviewEditButtons = screen.getAllByTestId("review-edit-button");
  const reviewDeleteButtons = screen.getAllByTestId("review-delete-button");

  expect(card).toBeInTheDocument();
  expect(cardCount).toHaveLength(1);
  expect(movieEditButton).toBeInTheDocument();
  expect(movieDeleteButton).toBeInTheDocument();
  expect(reviewEditButtons).toHaveLength(2);
  expect(reviewDeleteButtons).toHaveLength(2);
});

test("review component works fine", async () => {
  renderMoviePage(adminUser,mockMovieData);
  const moviePageReviewRating = await screen.findByTestId(
    "moviepage-review-rating"
  );
  expect(moviePageReviewRating).toHaveAttribute("data-value", "0");
  const moviePageReviewDescription = screen.getByTestId(
    "moviepage-review-description"
  ) as HTMLInputElement;

  expect(moviePageReviewDescription.value).toBe("");
  fireEvent.change(moviePageReviewDescription, {
    target: { value: "changeDescription" },
  });
  const starRating = screen.getByRole("radio", { name: "4 Stars" });
  fireEvent.click(starRating);

  expect(moviePageReviewDescription.value).toBe("changeDescription");
  expect(moviePageReviewRating).toHaveAttribute("data-value","4");
});

test("Loadingcomponent should be visible, after loading should disappear", async () => {
  renderMoviePage(adminUser,mockMovieData);
  const loader = await screen.findByTestId("loader");
  expect(loader).toBeInTheDocument();
  await waitFor(() => {
    const card = screen.queryByTestId("moviepage-card");
    expect(card).toBeInTheDocument();
    expect(loader).not.toBeInTheDocument();
  });
});
