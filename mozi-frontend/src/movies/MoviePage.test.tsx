import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { GET_CATEGORIES } from "../categories/categoryQueries";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import { CurrentUser, UserRole } from "../gql/graphql";
import MoviePage from "./MoviePage";
import { GET_MOVIE_BY_ID } from "./movieQueries";

const mockMovieData = [
  {
    request: {
      query: GET_MOVIE_BY_ID,
      variables: {
        input: {
          id: "idM4",
        },
        input2: {
          movie_id: "idM4",
          limit: 3,
          offset: 0,
        },
        input3: {
          movie_id: "idM4",
          user_id: "",
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
          category: {
            id: "idC1",
            name: "name1",
          },
          rating: "4",
        },
        getReviewsOfMovie: [
          {
            id: "idR2",
            rating: "4",
            description: "Wow so good",
            movie: {
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
            rating: "2",
            description: "not good",
            movie: {
              id: "idM4",
            },
            user: {
              id: "idU3",
              first_name: "viewer",
              last_name: "viewer",
            },
          }
        ],
        getNumberOfReviewsOfMovie:{
          totalCount:2
        }
      },
    },
  },
  {
    request: {
      query: GET_CATEGORIES
    },
    result: {
      data:{
        getCategories:[
          {
            id:"idC1",
            name:"name1"
          },
          {
            id:"idC2",
            name:"name2"
          }
        ]
      }
    }
  }
];

const adminUser: CurrentUser = {
  id: "idU1",
  first_name: "admin",
  last_name: "admin",
  email: "admin@example.com",
  role: UserRole["Admin"],
  token: "token1",
};

const viewerUser: CurrentUser = {
  id: "idU3",
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  role: UserRole["Viewer"],
  token: "token1",
};

const cache = new InMemoryCache();

function renderMoviePage(currUser?: CurrentUser) {
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
      <MockedProvider cache={cache} mocks={mockMovieData}>
        <RouterProvider router={router} />
      </MockedProvider>
    </MockedSessionContext>
  );
}

test("Loading skeleton appears as placeholder for reviews of movie", async() => {
  renderMoviePage(adminUser)

  const skeleton = await screen.findAllByTestId("skeleton-component")
  expect(skeleton).toBeTruthy()
  expect(skeleton[0]).toBeInTheDocument()
  expect(skeleton).toHaveLength(3)

  const cards = await screen.findAllByTestId("review-card")
  expect(skeleton[0]).not.toBeInTheDocument()
})

test("Should not have edit and delete button on moviecard if current user is viewer", async () => {
  renderMoviePage(viewerUser);
  const card = await screen.findByTestId("moviepage-card");
  const movieEditButton = screen.queryByTestId("moviepage-edit-button");
  const movieDeleteButton = screen.queryByTestId("moviepage-delete-button");
  expect(movieDeleteButton).not.toBeInTheDocument();
  expect(movieEditButton).not.toBeInTheDocument();
});

test("Should have edit and delete button on reviewcard where user is viewer and has review on movie", async () => {
  renderMoviePage(viewerUser);

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
  renderMoviePage(adminUser);

  const reviewCard = await screen.findAllByTestId("review-card");
  expect(reviewCard).toHaveLength(2);
});

test("admin/editor should have edit and delete button for movies/reviews", async () => {
  renderMoviePage(adminUser);
  const card = await screen.findByTestId("moviepage-card");
  const cardCount = screen.getAllByTestId("moviepage-card");
  const movieEditButton = screen.getByTestId("moviepage-edit-button");
  const movieDeleteButton = screen.getByTestId("moviepage-delete-button");
  const reviewEditButtons = await screen.findAllByTestId("review-edit-button");
  const reviewDeleteButtons = screen.getAllByTestId("review-delete-button");

  expect(card).toBeInTheDocument();
  expect(cardCount).toHaveLength(1);
  expect(movieEditButton).toBeInTheDocument();
  expect(movieDeleteButton).toBeInTheDocument();
  expect(reviewEditButtons).toHaveLength(2);
  expect(reviewDeleteButtons).toHaveLength(2);
});

test("review component works fine", async () => {
  renderMoviePage(adminUser);
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
  expect(moviePageReviewRating).toHaveAttribute("data-value", "4");
});
