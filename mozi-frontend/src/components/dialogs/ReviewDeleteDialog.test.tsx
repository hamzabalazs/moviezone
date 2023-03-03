import { fireEvent, render, screen } from "@testing-library/react";
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
  userId:"idU1",
  firstName:"admin",
  lastName:"admin",
  description:"descriptiontest",
  rating:3
}

function renderReviewDeleteDialog(props:{
  review?:ReviewUpdated;
  onClose?:() => void;
  deleteReview?: ReviewData["deleteReview"]
}) {
  const isOpenDelete = true;
  const reviewId = "idR2";
  return render(
    <MockedApiContext>
      <ReviewDeleteDialog
        review={props.review}
        onClose={props.onClose}
        setAlert={jest.fn()}

      />
    </MockedApiContext>
  );
}

test("review delete works fine", async () => {
  const setIsOpenDelete = jest.fn();

  const cardDeleteDialog = screen.getByTestId("review-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", {
    name: "buttons.accept",
  }); // not tested
  const cardDeleteDialogQuit = screen.getByRole("button", {
    name: "buttons.quit",
  });

  fireEvent.click(cardDeleteDialogQuit);
  expect(setIsOpenDelete).toHaveBeenCalledTimes(1);
});
