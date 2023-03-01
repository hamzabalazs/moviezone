import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import ReviewEditModal from "./ReviewEditModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderReviewEditModal(
  setIsOpenEdit: jest.Mock<any, any>,
  setDescription: jest.Mock<any, any>
) {
  const isOpenEdit = true;
  const description = "mockDescription";
  const reviewId = "idR1";
  return render(
    <MockedApiContext>
      <ReviewEditModal
        isOpenEdit={isOpenEdit}
        setIsOpenEdit={setIsOpenEdit}
        description={description}
        setDescription={setDescription}
        reviewId={reviewId}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
      />
    </MockedApiContext>
  );
}

test("review edit works fine", async () => {
  const setIsOpenEdit = jest.fn();
  const setDescription = jest.fn();
  renderReviewEditModal(setIsOpenEdit, setDescription);

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
    expect(setDescription).toHaveBeenCalledTimes(1);
  });
});
