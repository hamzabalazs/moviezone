import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import { Home } from "../pages/App";

const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

const GET_MOVIES = gql`
  query GetMovies {
    getMovies {
      id
      title
      poster
      release_date
      category {
        id
      }
      rating
    }
  }
`;

const mockData = [
  {
    request:{
      query:GET_MOVIES
    },
    result:{
      data:{
        getMovies:[
          {
            id:"idM1",
            title:"title1",
            poster:"poster1",
            release_date:"01/01/2021",
            category:{
              id:"idC1"
            },
            rating:"2"
          },
          {
            id:"idM2",
            title:"title2",
            poster:"poster2",
            release_date:"02/02/2022",
            category:{
              id:"idC1"
            },
            rating:"4"
          },
          {
            id:"idM3",
            title:"title3",
            poster:"poster3",
            release_date:"03/03/2023",
            category:{
              id:"idC2"
            },
            rating:"5"
          },
        ]
      }
    }
  },
  {
    request:{
      query:GET_CATEGORIES
    },
    result:{
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
]

function renderHome() {
  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false} mocks={mockData}>
        <MockedSessionContext>
          <Home />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

test("LoadingComponent should show while loading, after loading should not show",async() => {
  const {queryByTestId} = renderHome()

  const loader = queryByTestId("loader")
  expect(loader).toBeInTheDocument()

  await waitFor(() => {
    expect(loader).not.toBeInTheDocument()
  })
})

test("Should have correct amount of cards for movielist", async() => {
  renderHome();

  const cards = await screen.findAllByTestId("movie-list-card");
  expect(cards).toHaveLength(3);
});

test("movie autocomplete works fine", async () => {
  renderHome();

  const autocompleteDropdowns = await screen.findAllByRole("button", { name: "Open" });
  const movieAutocompleteDropdown = autocompleteDropdowns[0];

  userEvent.click(movieAutocompleteDropdown);
  expect(screen.getByRole("presentation")).toBeVisible();
  const movieOptions = screen.getAllByRole("option");
  expect(movieOptions).toHaveLength(3);

  userEvent.click(movieOptions[0]);
  expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  const addedMovie = screen.getByRole("button", { name: "title1" });
  expect(addedMovie).toHaveTextContent("title1");
  const addedMovieCancel = screen.getByTestId("CancelIcon");

  await waitFor(() => {
    const movielistcard = screen.getAllByTestId("movie-list-card");
    expect(movielistcard).toHaveLength(1);
  });

  userEvent.click(addedMovieCancel);
  await waitFor(() => {
    expect(addedMovie).not.toBeInTheDocument();
  });
});

test("category autocomplete works fine", async () => {
  renderHome();

  const autocompleteDropdowns = await screen.findAllByRole("button", { name: "Open" });
  const categoryAutocompleteDropdown = autocompleteDropdowns[1];

  userEvent.click(categoryAutocompleteDropdown);
  expect(screen.getByRole("presentation")).toBeVisible();
  const categoryOptions = screen.getAllByRole("option");
  expect(categoryOptions).toHaveLength(2);
  expect(categoryOptions[1]).toHaveTextContent("name2");

  userEvent.click(categoryOptions[1]);
  expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  const addedCategory = screen.getByRole("button", { name: "name2" });
  expect(addedCategory).toHaveTextContent("name2");
  const addedCategoryCancel = screen.getByTestId("CancelIcon");

  await waitFor(() => {
    const movielistcard = screen.getAllByTestId("movie-list-card");
    expect(movielistcard).toHaveLength(1);
  });

  userEvent.click(addedCategoryCancel);
  await waitFor(() => {
    expect(addedCategory).not.toBeInTheDocument();
  });
});
