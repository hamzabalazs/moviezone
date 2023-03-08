import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedApiContext } from "../common/testing/MockedApiProvider";
import { Home } from "../pages/App";

function renderHome() {
  return render(
    <MemoryRouter>
      <MockedApiContext>
        <Home />
      </MockedApiContext>
    </MemoryRouter>
  );
}

test("correct amount of cards for movielist in context", () => {
  renderHome();

  const cards = screen.getAllByTestId("movie-list-card");
  expect(cards).toHaveLength(8);
});

test("add movie modal opens and shows correctly", () => {
  renderHome();

  const addMovieButton = screen.getByTestId("movie-add-button");
  fireEvent.click(addMovieButton);

  const movieAddModal = screen.getByTestId("movie-add-modal");
  const movieAddTitle = screen.getByTestId("movie-add-title");
  const movieAddDescription = screen.getByTestId("movie-add-description");
  const movieAddrelease_date = screen.getByTestId("movie-add-release_date");
  const movieAddCategory = screen.getByTestId("movie-add-category");
  const movieAddPoster = screen.getByTestId("movie-add-poster");

  expect(movieAddModal).not.toHaveAttribute("aria-hidden", "true");
  expect(movieAddTitle).toBeInTheDocument();
  expect(movieAddDescription).toBeInTheDocument();
  expect(movieAddrelease_date).toBeInTheDocument();
  expect(movieAddCategory).toBeInTheDocument();
  expect(movieAddPoster).toBeInTheDocument();
});

test("movie autocomplete works fine", async () => {
  renderHome();

  const autocompleteDropdowns = screen.getAllByRole("button", { name: "Open" });
  const movieAutocompleteDropdown = autocompleteDropdowns[0];

  fireEvent.click(movieAutocompleteDropdown);
  expect(screen.getByRole("presentation")).toBeVisible();
  const movieOptions = screen.getAllByRole("option");
  expect(movieOptions).toHaveLength(8);
  expect(movieOptions[4]).toHaveTextContent("title5");

  fireEvent.click(movieOptions[0]);
  expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  const addedMovie = screen.getByRole("button", { name: "title1" });
  expect(addedMovie).toHaveTextContent("title1");
  const addedMovieCancel = screen.getByTestId("CancelIcon");

  await waitFor(() => {
    const movielistcard = screen.getAllByTestId("movie-list-card");
    expect(movielistcard).toHaveLength(1);
  });

  fireEvent.click(addedMovieCancel);
  await waitFor(() => {
    expect(addedMovie).not.toBeInTheDocument();
  });
});

test("category autocomplete works fine", async () => {
  renderHome();

  const autocompleteDropdowns = screen.getAllByRole("button", { name: "Open" });
  const categoryAutocompleteDropdown = autocompleteDropdowns[1];

  fireEvent.click(categoryAutocompleteDropdown);
  expect(screen.getByRole("presentation")).toBeVisible();
  const categoryOptions = screen.getAllByRole("option");
  expect(categoryOptions).toHaveLength(3);
  expect(categoryOptions[1]).toHaveTextContent("name2");

  fireEvent.click(categoryOptions[1]);
  expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  const addedCategory = screen.getByRole("button", { name: "name2" });
  expect(addedCategory).toHaveTextContent("name2");
  const addedCategoryCancel = screen.getByTestId("CancelIcon");

  await waitFor(() => {
    const movielistcard = screen.getAllByTestId("movie-list-card");
    expect(movielistcard).toHaveLength(3);
  });

  fireEvent.click(addedCategoryCancel);
  await waitFor(() => {
    expect(addedCategory).not.toBeInTheDocument();
  });
});
