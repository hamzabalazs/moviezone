import { act, fireEvent, render, screen } from "@testing-library/react";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import MovieAddModal from "./MovieAddModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

function renderMovieAddModal() {
  const isOpenAdd = true;
  return render(
    <MockedApiContext>
      <MovieAddModal
        isOpenAdd={isOpenAdd}
        setIsOpenAdd={jest.fn()}
        setIsOpenAlert={jest.fn()}
        setAlertMessage={jest.fn()}
        setAlertType={jest.fn()}
      />
    </MockedApiContext>
  );
}

test("add movie works fine", async () => {
  renderMovieAddModal();

  const movieAddModal = screen.getByTestId("movie-add-modal");
  expect(movieAddModal).not.toHaveAttribute("aria-hidden", "true");
  const movieAddModalButton = screen.getByRole("button", {
    name: "buttons.add",
  }); // not tested
  const movieAddTitle = screen.getByTestId(
    "movie-add-modal-title"
  ) as HTMLInputElement;
  const movieAddDescription = screen.getByTestId(
    "movie-add-modal-description"
  ) as HTMLInputElement;
  const movieAddReleaseDate = screen.getByTestId(
    "movie-add-modal-releaseDate"
  ) as HTMLInputElement;
  const movieAddCategory = screen.getByTestId(
    "movie-add-modal-category"
  ) as HTMLInputElement;
  const movieAddPoster = screen.getByTestId(
    "movie-add-modal-poster"
  ) as HTMLInputElement;
  const file = new File(["(⌐□_□)"], "chucknorris.jpg", { type: "image/jpg" });

  expect(movieAddTitle.value).toBe("");
  expect(movieAddDescription.value).toBe("");
  expect(movieAddReleaseDate.value).toBe("");
  expect(movieAddCategory.value).toBe("");
  expect(movieAddPoster.value).toBe("");

  await act(async () => {
    fireEvent.change(movieAddTitle, { target: { value: "changeTitle" } });
    fireEvent.change(movieAddDescription, {
      target: { value: "changeDescription" },
    });
    fireEvent.change(movieAddReleaseDate, {
      target: { value: "changeReleaseDate" },
    });
    fireEvent.change(movieAddCategory, { target: { value: "idC3" } });
    fireEvent.change(movieAddPoster, { target: { files: [file] } });
  });

  expect(movieAddTitle.value).toBe("changeTitle");
  expect(movieAddDescription.value).toBe("changeDescription");
  expect(movieAddReleaseDate.value).toBe("changeReleaseDate");
  expect(movieAddCategory.value).toBe("idC3");
  if (movieAddPoster.files)
    expect(movieAddPoster.files[0].name).toBe("chucknorris.jpg");
});
