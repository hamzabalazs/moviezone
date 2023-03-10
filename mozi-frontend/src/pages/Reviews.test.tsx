import { gql } from "@apollo/client";
import {MockedProvider} from "@apollo/client/testing"
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CurrUser } from "../api/types";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import Reviews from "./Reviews";

const GET_REVIEWS = gql`
  query GetReviews {
    getReviews {
      id
      rating
      description
      movie {
        title
        id
      }
      user {
        id
        first_name
        last_name
      }
    }
  }
`;

const mockReviewData = {
  request: {
    query: GET_REVIEWS,
  },
  result: {
    data: {
      getReviews: [
        {
          id: "idR1",
          rating: "4",
          description: "Loved it, so good!",
          movie: {
            title: "MovieTitle1",
            id: "idM1",
          },
          user: {
            id:"idU3",
            first_name: "viewer",
            last_name: "viewer",
          },
        },
        {
          id: "idR2",
          rating: "1",
          description: "Bad!",
          movie: {
            title: "MovieTitle1",
            id: "idM1",
          },
          user: {

            id:"idU2",
            first_name: "user2",
            last_name: "user2",
          },
        },
        {
          id: "idR3",
          rating: "3",
          description: "Good!",
          movie: {
            title: "MovieTitle2",
            id: "idM2",
          },
          user: {
            id:"idU1",
            first_name: "user1",
            last_name: "user1",
          },
        },
      ],
    },
  },
};

function renderReviews(currUser?: CurrUser) {

  return render(
    <MemoryRouter>
      <MockedProvider addTypename={false} mocks={[mockReviewData]}>
        <MockedSessionContext value={{ user: currUser }}>
          <Reviews />
        </MockedSessionContext>
      </MockedProvider>
    </MemoryRouter>
  );
}

const viewerUser: CurrUser = {
  id: "idU3",
  first_name: "viewer",
  last_name: "viewer",
  email: "viewer@example.com",
  password: "viewer",
  role: "viewer",
  token: "token1",
};

test("Should show LoadingComponent at first, after loading should show review page",async() =>{
  const {queryByTestId} = renderReviews(viewerUser)
  const loader = queryByTestId("loader")
  expect(loader).toBeInTheDocument()
  await waitFor(() => {
    expect(loader).not.toBeInTheDocument()
  })
})

test("correct amount of reviews show up for user", async () => {
  renderReviews(viewerUser);
  await waitFor(() => {
    const cards = screen.getAllByTestId("review-card");
    expect(cards).toHaveLength(1);
  });
});

test("review edit modal opens and shows correctly", async() => {
  renderReviews(viewerUser);

  const cardEditButtons = await screen.findAllByRole("button", { name: "Edit" });
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

test("review delete dialog opens and shows correctly", async() => {
  renderReviews(viewerUser);
  const cardDeleteButtons = await screen.findAllByRole("button", { name: "Delete" });

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
