import { fireEvent, render, screen } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import ReviewDeleteDialog from "./ReviewDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderReviewDeleteDialog(setIsOpenDelete: jest.Mock<any, any>) {
  const isOpenDelete = true;
  const reviewId = "idR2";
  return render(
    <MockedApiContext>
      <ReviewDeleteDialog
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
        reviewId={reviewId}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
        setReviewId={jest.fn()}
        setSelectedMovieId={jest.fn()}
      />
    </MockedApiContext>
  );
}

test("review delete works fine", async () => {
  const setIsOpenDelete = jest.fn();
  renderReviewDeleteDialog(setIsOpenDelete);

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
