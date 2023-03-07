import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ReviewData } from "../../api/review/useReviews";
import { Review, ReviewUpdated } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import ReviewEditModal from "./ReviewEditModal";

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
    rating:0
  } ,
  description: "description1EDITED",
  rating: 5,
};

const newReview = {
  id: "idR1",
  description: "EDITED",
  rating: "5",
};

function renderReviewEditModal(props: {
  review?: Review;
  onClose?: () => void;
  editReview?: ReviewData["editReview"];
}) {
  return render(
    <MockedApiContext value={{editReview:props.editReview}}>
      <ReviewEditModal review={props.review} onClose={props.onClose} />
    </MockedApiContext>
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
  const editReviewSpy = jest.fn();
  const { getByTestId, getByRole } = renderReviewEditModal({
    review: testReview,
    editReview: editReviewSpy,
  });

  const description = getByTestId("review-edit-modal-description")
  const editButton = getByTestId("review-edit-modal-edit")
  const starRating5 = getByRole("radio",{name:"5 Stars"})

  fireEvent.change(description, {target: {value:newReview.description}})
  fireEvent.click(starRating5)
  

  act(() => {
    userEvent.click(editButton)
  })

  await waitFor(() => {
    expect(editReviewSpy).toHaveBeenCalledWith(newReview)
  })
});
