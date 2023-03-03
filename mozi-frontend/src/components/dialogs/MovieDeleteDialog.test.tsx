import { fireEvent, render, screen } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import MovieDeleteDialog from "./MovieDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderMovieDeleteDialog(setIsOpenDelete: jest.Mock<any, any>) {
  const isOpenDelete = true;
  const movieId = "idM2";
  return render(
    <MockedApiContext>
      {/* <MovieDeleteDialog
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
        movieId={movieId}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
      /> */}
    </MockedApiContext>
  );
}

test("movie delete works fine", async () => {
  const setIsOpenDelete = jest.fn();
  renderMovieDeleteDialog(setIsOpenDelete);

  const cardDeleteDialog = screen.getByTestId("movie-delete-dialog");
  const cardDeleteDialogAccept = screen.getByRole("button", {
    name: "buttons.accept",
  }); // not tested
  const cardDeleteDialogQuit = screen.getByRole("button", {
    name: "buttons.quit",
  });

  fireEvent.click(cardDeleteDialogQuit);
  expect(setIsOpenDelete).toHaveBeenCalledTimes(1);
});
