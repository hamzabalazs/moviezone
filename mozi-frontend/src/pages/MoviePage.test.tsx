import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import { CurrUser } from "../api/types";
import { MockedApiContext } from "../common/testing/MockedApiProvider";

import MoviePage from "./MoviePage";

const adminUser: CurrUser = {
  id: "idU1",
  first_name: "admin",
  last_name: "admin",
  email: "admin@example.com",
  password: "admin",
  role: "admin",
  token: "token1",
};

function renderMoviePage(user?: CurrUser) {
  const FAKE_EVENT = { name: "test event" };
  const routes = [
    {
      path: "/:currMovieId",
      element: <MoviePage />,
      loader: () => FAKE_EVENT,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/", "/idM4"],
    initialIndex: 1,
  });

  return render(
    <MockedApiContext value={{ user }}>
      <RouterProvider router={router} />
    </MockedApiContext>
  );
}

test("movie has correct amount of reviews", async () => {
  renderMoviePage(adminUser);

  await waitFor(() => {
    const reviewCard = screen.getAllByTestId("review-card");
    expect(reviewCard).toHaveLength(2);
  });
});

test("admin/editor has edit and delete button for movies/reviews", async () => {
  renderMoviePage(adminUser);
  await waitFor(() => {
    const card = screen.getByTestId("moviepage-card");
    const cardCount = screen.getAllByTestId("moviepage-card");
    const movieEditButton = screen.getByTestId("moviepage-edit-button");
    const movieDeleteButton = screen.getByTestId("moviepage-delete-button");
    const reviewEditButtons = screen.getAllByTestId("review-edit-button");
    const reviewDeleteButtons = screen.getAllByTestId("review-delete-button");

    expect(card).toBeVisible();
    expect(cardCount).toHaveLength(1);
    expect(movieEditButton).toBeVisible();
    expect(movieDeleteButton).toBeVisible();
    expect(reviewEditButtons).toHaveLength(2);
    expect(reviewDeleteButtons).toHaveLength(2);
  });
});

test("review component works fine", async () => {
  renderMoviePage();
  await waitFor(() => {
    const moviePageReviewRating = screen.getByTestId("moviepage-review-rating");
  });
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
  expect(screen.getByTestId("moviepage-review-rating")).toHaveAttribute(
    "data-value",
    "4"
  );
});
