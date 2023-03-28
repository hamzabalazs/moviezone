import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import { Home } from "./Home";
import { GET_HOME_PAGE_DATA } from "./movieQueries";

const category: string[] = [];
const orderByTitle: boolean | null = null;
const orderByCategory: boolean | null = null;

const mockData = [
  {
    request: {
      query: GET_HOME_PAGE_DATA,
      variables: {
        input: {
          limit: 9,
          category,
          searchField: "",
          offset: 0,
          orderByTitle,
          orderByCategory,
        },
        input2: {
          category,
          searchField: "",
        },
      },
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
        ],
        getMovies: [
          {
            id: "idM1",
            title: "title1",
            poster: "poster1",
            release_date: "01/01/2021",
            category: {
              id: "idC1",
            },
            rating: "2",
          },
          {
            id: "idM2",
            title: "title2",
            poster: "poster2",
            release_date: "02/02/2022",
            category: {
              id: "idC1",
            },
            rating: "4",
          },
          {
            id: "idM3",
            title: "title3",
            poster: "poster3",
            release_date: "03/03/2023",
            category: {
              id: "idC2",
            },
            rating: "5",
          },
        ],
        getNumberOfMovies: {
          totalCount: 3,
        },
      },
    },
  },
];

function renderHome() {
  return render(
    <MockedProvider addTypename={false} mocks={mockData}>
      <MockedSessionContext>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </MockedSessionContext>
    </MockedProvider>
  );
}

test("Loading skeleton appears as placeholder", async() => {
  renderHome()

  const skeleton = screen.getAllByTestId("movie-skeleton-component")
  expect(skeleton).toBeTruthy()
  expect(skeleton[0]).toBeInTheDocument()
  expect(skeleton).toHaveLength(9)

  const cards = await screen.findAllByTestId("movie-list-card")
  expect(skeleton[0]).not.toBeInTheDocument()
})

test("Should have correct amount of cards for movielist", async () => {
  renderHome();

  const cards = await screen.findAllByTestId("movie-list-card");
  expect(cards).toHaveLength(3);
});

test("category autocomplete works fine", async () => {
  renderHome();

  const autocompleteDropdowns = await screen.findAllByRole("button", {
    name: "Open",
  });
  const categoryAutocompleteDropdown = autocompleteDropdowns[0];

  userEvent.click(categoryAutocompleteDropdown);
  const categoryOptions = await screen.findAllByRole("option");
  expect(categoryOptions).toHaveLength(2);
  expect(categoryOptions[1]).toHaveTextContent("name2");

  userEvent.click(categoryOptions[1]);
  expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  const addedCategory = screen.getByRole("button", { name: "name2" });
  expect(addedCategory).toHaveTextContent("name2");
  const addedCategoryCancel = screen.getByTestId("CancelIcon");

  userEvent.click(addedCategoryCancel);
  await waitFor(() => {
    expect(addedCategory).not.toBeInTheDocument();
  });
});
