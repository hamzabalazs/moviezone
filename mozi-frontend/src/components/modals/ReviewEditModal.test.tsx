import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReviewData } from "../../api/review/useReviews";
import { Review, ReviewUpdated } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import ReviewEditModal from "./ReviewEditModal";

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

const newReview: ReviewUpdated = {
  id: "idR1",
  movieId: "idM2",
  userId:"idU1",
  firstName:"admin",
  lastName:"admin",
  description:"EDITED",
  rating:5
}

function renderReviewEditModal(props:{
  review?:ReviewUpdated
  onClose?: () => void;
  editReview?: ReviewData["editReview"]
}) {
  const isOpenEdit = true;
  const description = "mockDescription";
  const reviewId = "idR1";
  return render(
    <MockedApiContext>
      <ReviewEditModal
        review={props.review}
        onClose={props.onClose}
        setAlert={jest.fn()}
      />
    </MockedApiContext>
  );
}

test("review edit works fine", async () => {
  renderReviewEditModal({});

  const reviewEditModalButton = screen.getByRole("button", {
    name: "buttons.edit",
  }); // not tested
  const reviewEditModalDescription = screen.getByTestId(
    "review-edit-modal-description"
  ) as HTMLInputElement;
  const reviewEditModalRating = screen.getByTestId(
    "review-edit-modal-rating"
  ) as HTMLInputElement;
  expect(reviewEditModalDescription.value).toBe("mockDescription");
  expect(reviewEditModalRating).toHaveAttribute("data-value", "0");
  fireEvent.change(reviewEditModalDescription, {
    target: { value: "changeDescription" },
  });
  expect(reviewEditModalDescription.value).toBe("changeDescription");

  const starRating = screen.getByRole("radio", { name: "3 Stars" });
  fireEvent.click(starRating);
  await waitFor(() => {
    expect(reviewEditModalDescription.value).toBe("changeDescription");
    expect(reviewEditModalRating).toHaveAttribute("data-value", "3");
  });
});
