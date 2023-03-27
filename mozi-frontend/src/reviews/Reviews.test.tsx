import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import { CurrentUser, UserRole } from "../gql/graphql";
import Reviews from "./Reviews";
import { GET_REVIEWS } from "./useReviewsData";

const mockReviewData = [
  {
    request: {
      query: GET_REVIEWS,
      variables: {
        input: {
          user_id: "idU1",
          limit: 3,
          offset: 0,
        },
        input2: {
          user_id: "idU1",
          movie_id: "",
        },
      },
    },
    result: {
      data: {
        getReviewsOfUser: [
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
        getNumberOfReviewsOfUser: {
          totalCount: 1,
        },
      },
    },
  },
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

test("Loading skeleton appears as placeholder", async () => {
  renderReviews(viewerUser);

  const skeleton = screen.getAllByTestId("skeleton-component");
  expect(skeleton).toBeTruthy();
  expect(skeleton[0]).toBeInTheDocument();
  expect(skeleton).toHaveLength(3);

  const cards = await screen.findAllByTestId("review-card");
  expect(skeleton[0]).not.toBeInTheDocument();
});

test("correct amount of reviews show up for user", async () => {
  renderReviews(viewerUser);
  const cards = await screen.findAllByTestId("review-card");
  expect(cards).toHaveLength(1);
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
