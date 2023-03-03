import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewData } from "../../api/review/useReviews";
import { ReviewUpdated } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import ReviewDeleteDialog from "./ReviewDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const testReview: ReviewUpdated = {
  id: "idR1",
  movieId: "idM2",
  userId: "idU1",
  firstName: "admin",
  lastName: "admin",
  description: "descriptiontest",
  rating: 3,
};

function renderReviewDeleteDialog(props: {
  review?: ReviewUpdated;
  onClose?: () => void;
  deleteReview?: ReviewData["deleteReview"];
}) {
  return render(
    <MockedApiContext value={{deleteReview:props.deleteReview}}>
      <ReviewDeleteDialog
        review={props.review}
        onClose={props.onClose}
        setAlert={jest.fn()}
      />
    </MockedApiContext>
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

test("calls deleteReview with correct values if acceptButton is clicked", async () => {
  const deleteReviewSpy = jest.fn();
  const { getByTestId } = renderReviewDeleteDialog({
    review: testReview,
    deleteReview: deleteReviewSpy,
  });

  const acceptButton = getByTestId("review-delete-dialog-accept")
  expect(deleteReviewSpy).not.toHaveBeenCalled()

  act(() => {
    userEvent.click(acceptButton)
  })

  await waitFor(() => {
    expect(deleteReviewSpy).toHaveBeenCalledWith(testReview.id)
  })
});
