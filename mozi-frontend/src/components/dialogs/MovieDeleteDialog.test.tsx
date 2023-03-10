import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Movie } from "../../api/types";
import { MockedSessionContext } from "../../common/testing/MockedSessionProvider";
import MovieDeleteDialog from "./MovieDeleteDialog";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const testMovie: Movie = {
  id: "idM1",
  title: "title1",
  description: "description1",
  release_date: "22/02/2023",
  poster: "poster1",
  category: {
    id:"idC1",
    name:"name1"
  },
  rating: "3",
};

function renderMovieDeleteDialog(props:{
  movie?: Movie;
  onClose?:() => void;
}) {
  return render(
    <MockedSessionContext>
      <MovieDeleteDialog
        movie={props.movie}
        onClose={props.onClose}

      />
    </MockedSessionContext>
  );
}

test("If movie is not provided should not open dialog",() => {
  const {queryByTestId} = renderMovieDeleteDialog({})

  const dialog = queryByTestId("movie-delete-dialog")
  
  expect(dialog).not.toBeInTheDocument()
})

test("If movie is provided should show dialog correctly", () => {
  const {queryByTestId} = renderMovieDeleteDialog({movie:testMovie})

  const dialog = queryByTestId("movie-delete-dialog")
  const acceptButton = queryByTestId("movie-delete-accept")
  const quitButton = queryByTestId("movie-delete-quit")
  
  expect(dialog).toBeInTheDocument()
  expect(acceptButton).toBeInTheDocument()
  expect(quitButton).toBeInTheDocument()
})

test("calls onClose when quitButton is clicked",async() => {
  const onCloseSpy = jest.fn()
  const {getByTestId} = renderMovieDeleteDialog({movie:testMovie,onClose:onCloseSpy})

  const quitButton = getByTestId("movie-delete-quit")
  expect(onCloseSpy).not.toHaveBeenCalled()


  act(() => {
    userEvent.click(quitButton)
  })

  await waitFor(() => {
    expect(onCloseSpy).toHaveBeenCalled()

  })

})

// test("calls deleteMovie with correct value if acceptButton is clicked",async() => {
//   const deleteMovieSpy = jest.fn()
//   const {getByTestId} = renderMovieDeleteDialog({movie:testMovie,deleteMovie:deleteMovieSpy})

//   const acceptButton = getByTestId("movie-delete-accept")

//   act(() => {
//     userEvent.click(acceptButton)
//   })

//   await waitFor(() => {
//     expect(deleteMovieSpy).toHaveBeenCalledWith(testMovie.id)
//   })
// })
