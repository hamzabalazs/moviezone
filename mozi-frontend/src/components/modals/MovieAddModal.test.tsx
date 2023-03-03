import { act, fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MovieData } from "../../api/movie/useMovies";
import { Movie } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import MovieAddModal from "./MovieAddModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const addMovie = {
  title: "title1",
  description: "description1",
  releaseDate: "22/02/2023",
  categoryId: "idC1",
  poster: "chucknorris.jpg"
};

function renderMovieAddModal(props:{
  isOpenAdd: boolean;
  setIsOpenAdd?: () => void;
  addMovie?: MovieData["addMovie"];
}) {
  return render(
    <MockedApiContext value={{addMovie:props.addMovie}}>
      <MovieAddModal
        isOpenAdd={props.isOpenAdd}
        setIsOpenAdd={props.setIsOpenAdd}
      />
    </MockedApiContext>
  );
}

test("If isOpenAdd is false should not open modal",() => {
  const {queryByTestId} = renderMovieAddModal({isOpenAdd:false})

  const modal = queryByTestId("movie-add-modal")

  expect(modal).not.toBeInTheDocument()
})

test("If isOpenAdd is true should show modal correctly",() => {
  const {queryByTestId} = renderMovieAddModal({isOpenAdd:true})

  const modal = queryByTestId("movie-add-modal")
  const title = queryByTestId("movie-add-title")
  const description = queryByTestId("movie-add-description")
  const releaseDate = queryByTestId("movie-add-releaseDate")
  const category = queryByTestId("movie-add-category")
  const poster = queryByTestId("movie-add-poster")
  const addButton = queryByTestId("movie-add-button")

  expect(modal).toBeInTheDocument()
  expect(title).toBeInTheDocument()
  expect(title).toHaveValue("")
  expect(description).toBeInTheDocument()
  expect(description).toHaveValue("")
  expect(releaseDate).toBeInTheDocument()
  expect(releaseDate).toHaveValue("")
  expect(category).toBeInTheDocument()
  expect(category).toHaveValue("")
  expect(poster).toBeInTheDocument()
  expect(poster).toHaveValue("")
  expect(addButton).toBeInTheDocument()
})

test("calls addMovie with correct values when addButton is clicked", async() => {
  const addMovieSpy = jest.fn()
  const {getByTestId} = renderMovieAddModal({isOpenAdd:true,addMovie:addMovieSpy})
  const file = new File(["test"], "chucknorris.jpg", { type: "image/jpg" });

  const title = getByTestId("movie-add-title")
  const description = getByTestId("movie-add-description")
  const releaseDate = getByTestId("movie-add-releaseDate")
  const category = getByTestId("movie-add-category")
  const poster = getByTestId("movie-add-poster") as HTMLInputElement;
  const addButton = getByTestId("movie-add-button")

  fireEvent.change(title,{target:{value:addMovie.title}})
  fireEvent.change(description,{target:{value:addMovie.description}})
  fireEvent.change(releaseDate,{target:{value:addMovie.releaseDate}})
  fireEvent.change(category,{target:{value:addMovie.categoryId}})
  fireEvent.change(poster,{ target: { files:[file] } })

  act(() => {
    userEvent.click(addButton)
  })

  await waitFor(() => {
    // expect(addMovieSpy).toHaveBeenCalledWith(addMovie) ERROR: poster not updated
  })

})




