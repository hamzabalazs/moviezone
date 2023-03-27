import { gql, InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedSessionContext } from "../common/testing/MockedSessionProvider";
import ReviewDeleteDialog from "./ReviewDeleteDialog";
import { SnackbarProvider } from "notistack";
import {Review, UserRole} from "../gql/graphql";
import { DELETE_REVIEW } from "./useReview";

const testReview:Review = {
  id: "idC1",
  user: {
    id: "idU2",
    first_name: "first",
    last_name: "last",
    email:"firstlast@gmail.com",
    role:UserRole["Admin"]
  },
  movie: {
    id: "idM2",
    title: "title2",
    description: "description2",
    release_date:"02/02/2022",
    poster:"poster2",
    category:{
      id:"idC1",
      name:"name2"
    },
    rating:"0"
  },
  description: "description1EDITED",
  rating: "5",
};

const deleteMock = {
  request: {
    query: DELETE_REVIEW,
    variables: {
      input: {
        id: testReview.id,
      },
    },
  },
  result: {
    data: {
      deleteReview: {
        id: testReview.id,
        description: testReview.description,
        rating: testReview.rating,
        movie: {
          id: testReview.movie.id,
        },
        user: {
          id: testReview.user.id,
          first_name: testReview.user.first_name,
          last_name: testReview.user.last_name,
        },
      },
    },
  },
};

const cache = new InMemoryCache();

function renderReviewDeleteDialog(props: {
  review?: Review;
  onClose?: () => void;
}) {
  return render(
    <SnackbarProvider autoHideDuration={null}>
      <MockedProvider cache={cache} mocks={[deleteMock]}>
        <MockedSessionContext>
          <ReviewDeleteDialog review={props.review} onClose={props.onClose} />
        </MockedSessionContext>
      </MockedProvider>
    </SnackbarProvider>
  );
}

test("If review is not provided should not open dialog", () => {
  const { queryByTestId } = renderReviewDeleteDialog({});

  const dialog = queryByTestId("review-delete-dialog");

  expect(dialog).not.toBeInTheDocument();
});

test("If review is provided should open dialog", () => {
  const { queryByTestId } = renderReviewDeleteDialog({ review: testReview });

  const dialog = queryByTestId("review-delete-dialog");
  const acceptButton = queryByTestId("review-delete-dialog-accept");
  const quitButton = queryByTestId("review-delete-dialog-quit");

  expect(dialog).toBeInTheDocument();
  expect(acceptButton).toBeInTheDocument();
  expect(quitButton).toBeInTheDocument();
});

test("calls onClose if quitButton is clicked", async () => {
  const onCloseSpy = jest.fn();
  const { getByTestId } = renderReviewDeleteDialog({
    review: testReview,
    onClose: onCloseSpy,
  });

  const quitButton = getByTestId("review-delete-dialog-quit");
  expect(onCloseSpy).not.toHaveBeenCalled();
  act(() => {
    userEvent.click(quitButton);
  });

  await waitFor(() => {
    expect(onCloseSpy).toHaveBeenCalled();
  });
});

test("Should call review delete successfully", async () => {
  const { getByTestId } = renderReviewDeleteDialog({
    review: testReview,
  });

  const acceptButton = getByTestId("review-delete-dialog-accept");
  expect(screen.queryByText("Success")).not.toBeInTheDocument();

  act(() => {
    userEvent.click(acceptButton);
  });

  await waitFor(() => {
    expect(screen.queryByText("successMessages.reviewDelete")).toBeInTheDocument();
  });
});
