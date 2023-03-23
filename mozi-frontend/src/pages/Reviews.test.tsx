import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import { CurrentUser, UserRole } from "../gql/graphql";
import Reviews from "./Reviews";
import { GET_EXTENDED_REVIEWS, GET_REVIEWS } from "./useReviewsData";

const mockReviewData = [
{
  request: {
    query: GET_EXTENDED_REVIEWS,
  },
  result: {
    data: {
      getExtendedReviews: [
        {
          id: "idR3",
          rating: "3",
          description: "Good!",
          movie: {
            title: "MovieTitle2",
            id: "idM2",
            description: "description2",
            poster: "poster2",
            release_date: "releaseDate2",
            category: {
              id: "idC1",
              name: "name1",
            },
            rating: "3",
            reviews: [
              {
                id: "idR3",
                rating: "3",
                description: "Good!",
                user: {
                  id: "idU1",
                  first_name: "user1",
                  last_name: "user1",
                },
                movie:{
                  id:"idR3"
                }
              },
            ],
          },
          user: {
            id: "idU1",
            first_name: "user1",
            last_name: "user1",
            email: "user1@email.com",
            role: UserRole["Viewer"]
          },
        },
      ],
    },
  },
},
{
  request:{
    query: GET_REVIEWS
  },
  result: {
    data: {
      getReviews: [
        {
          id: "idR3",
          rating: "3",
          description: "Good!",
          movie: {
            id: "idM2",
          },
          user: {
            id: "idU1",
            first_name: "user1",
            last_name: "user1",
          },
        },
      ],
    },
  },
}
];

function renderReviews(currUser?: CurrentUser) {
  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false} mocks={mockReviewData}>
        <MockedSessionContext value={{ user: currUser }}>
          <Reviews />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

const viewerUser: CurrentUser = {
  id: "idU1",
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  role: UserRole["Viewer"],
  token: "token1",
};

test("Should show LoadingComponent at first, after loading should show review page", async () => {
  const { queryByTestId } = renderReviews(viewerUser);
  const loader = queryByTestId("loader");
  expect(loader).toBeInTheDocument();
  await waitFor(() => {
    expect(loader).not.toBeInTheDocument();
  });
});

test("correct amount of reviews show up for user", async () => {
  renderReviews(viewerUser);
  await waitFor(() => {
    const cards = screen.getAllByTestId("review-card");
    expect(cards).toHaveLength(1);
  });
});

test("review edit modal opens and shows correctly", async () => {
  renderReviews(viewerUser);

  const cardEditButtons = await screen.findAllByRole("button", {
    name: "Edit",
  });
  userEvent.click(cardEditButtons[0]);
  const reviewEditModal = screen.getByTestId("review-edit-modal");
  const reviewEditModalButton = screen.getByRole("button", { name: "Edit" });
  const reviewEditModalDescription = screen.getByTestId(
    "review-edit-modal-description"
  );
  const reviewEditModalRating = screen.getByTestId("review-edit-modal-rating");
  expect(reviewEditModal).not.toHaveAttribute("aria-hidden", "true");
  expect(reviewEditModalDescription).toBeInTheDocument();
  expect(reviewEditModalRating).toBeInTheDocument();
  expect(reviewEditModalButton).toBeInTheDocument();
});

test("review delete dialog opens and shows correctly", async () => {
  renderReviews(viewerUser);
  const cardDeleteButtons = await screen.findAllByRole("button", {
    name: "Delete",
  });

  userEvent.click(cardDeleteButtons[0]);
  const reviewDeleteModal = screen.getByTestId("review-delete-dialog");
  const reviewDeleteDialogAcceptButton = screen.getByRole("button", {
    name: "Accept",
  });
  const reviewDeleteDialogQuitButton = screen.getByRole("button", {
    name: "Quit",
  });
  expect(reviewDeleteModal).not.toHaveAttribute("aria-hidden", "true");
  expect(reviewDeleteDialogAcceptButton).toBeInTheDocument();
  expect(reviewDeleteDialogQuitButton).toBeInTheDocument();
});
