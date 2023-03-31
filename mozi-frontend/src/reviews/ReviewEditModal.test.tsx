import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import ReviewEditModal from "./ReviewEditModal";
import { SnackbarProvider } from "notistack";
import { Review, UserRole } from "../gql/graphql";
import { UPDATE_REVIEW } from "./reviewQueries";
import { MemoryRouter } from "react-router-dom";

const testReview: Review = {
  id: "idC1",
  user: {
    id: "idU2",
    first_name: "first",
    last_name: "last",
    email: "firstlast@gmail.com",
    role: UserRole["Admin"],
  },
  movie: {
    id: "idM2",
    title: "title2",
    description: "description2",
    release_date: "02/02/2022",
    poster: "poster2",
    category: {
      id: "idC1",
      name: "name2",
    },
    rating: "0",
  },
  description: "description1EDITED",
  rating: "5",
};

const newReview = {
  id: "idR1",
  description: "EDITED",
  rating: "5",
};

const editMock = {
  request: {
    query: UPDATE_REVIEW,
    variables: {
      input: {
        id: testReview.id,
        description: newReview.description,
        rating: newReview.rating,
      },
    },
  },
  result: {
    data: {
      updateReview: {
        id: testReview.id,
        rating: newReview.rating,
        description: newReview.description,
        movie: {
          id: testReview.movie.id,
        },
        user: {
          first_name: testReview.user.first_name,
          last_name: testReview.user.last_name,
          id: testReview.user.id,
        },
      },
    },
  },
};

const cache = new InMemoryCache();

function renderReviewEditModal(props: {
  review?: Review;
  onClose?: () => void;
}) {
  return render(
    <MemoryRouter>
      <SnackbarProvider>
        <MockedProvider mocks={[editMock]} cache={cache}>
          <MockedSessionContext>
            <ReviewEditModal review={props.review} onClose={props.onClose} />
          </MockedSessionContext>
        </MockedProvider>
      </SnackbarProvider>
    </MemoryRouter>
  );
}

test("If review is not provided should not open", () => {
  const { queryByTestId } = renderReviewEditModal({});

  const modal = queryByTestId("review-edit-modal");
  const editButton = queryByTestId("review-edit-modal-edit");

  expect(modal).not.toBeInTheDocument();
  expect(editButton).not.toBeInTheDocument();
});

test("If review is provided should open modal with correct values", () => {
  const { getByTestId } = renderReviewEditModal({ review: testReview });

  const modal = getByTestId("review-edit-modal");
  const description = getByTestId("review-edit-modal-description");
  const rating = getByTestId("review-edit-modal-rating");
  const editButton = getByTestId("review-edit-modal-edit");

  expect(modal).toBeInTheDocument();
  expect(description).toBeInTheDocument();
  expect(description).toHaveValue(testReview.description);
  expect(rating).toBeInTheDocument();
  expect(rating).toHaveAttribute("data-value", testReview.rating.toString());
  expect(editButton).toBeInTheDocument();
});

test("calls editReview with correct values", async () => {
  const { getByTestId, getByRole } = renderReviewEditModal({
    review: testReview,
  });

  const description = getByTestId("review-edit-modal-description");
  const editButton = getByTestId("review-edit-modal-edit");
  const starRating5 = getByRole("radio", { name: "5 Stars" });
  expect(screen.queryByText("Success")).not.toBeInTheDocument();

  fireEvent.change(description, { target: { value: newReview.description } });
  userEvent.click(starRating5);

  act(() => {
    userEvent.click(editButton);
  });

  await waitFor(() => {
    expect(
      screen.queryByText("successMessages.reviewEdit")
    ).toBeInTheDocument();
  });
});
