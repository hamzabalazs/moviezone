import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewData } from "../../api/review/useReviews";
import { Review } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import ReviewDeleteDialog from "./ReviewDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const testReview: Review = {
  id: "idC1",
  user:{
    id:"idU2",
    first_name:"first",
    last_name:"last",
    email:"email",
    role:"viewer",
    password:"vivu"
  } ,
  movie:{
    id:"idM2",
    title:"title",
    description:"WAAA",
    poster:"posterket",
    release_date:"awuuu",
    category:{
      id:"idC1",
      name:"name1"
    },
    rating:"0"
  } ,
  description: "description1EDITED",
  rating: "5",
};

function renderReviewDeleteDialog(props: {
  review?: Review;
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
