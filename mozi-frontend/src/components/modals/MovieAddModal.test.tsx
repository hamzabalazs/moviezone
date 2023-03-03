import { act, fireEvent, render, screen } from "@testing-library/react";
import { Movie } from "../../api/types";
import { MockedApiContext } from "../../common/testing/MockedApiProvider";
import MovieAddModal from "./MovieAddModal";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const addMovie: Movie = {
  id: "idM1",
  title: "title1",
  description: "description1",
  releaseDate: "22/02/2023",
  poster: "poster1",
  categoryId: "idC1",
  rating: 3.5,
};

function renderMovieAddModal() {
  const isOpenAdd = true;
  return render(
    <MockedApiContext>
      <MovieAddModal
        isOpenAdd={isOpenAdd}
        setIsOpenAdd={jest.fn()}
        setAlert={jest.fn()}
        
      />
    </MockedApiContext>
  );
}

test("test",()=>{
  
})


