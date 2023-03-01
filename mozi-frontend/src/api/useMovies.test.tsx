import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react";
import { Movie } from "./types";
import { useMovies } from "./useMovies";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const movielist = {
  data: [
    {
      id: "idmovie1",
      title: "titlemovie",
      description: "descriptionmovie",
      poster: "postermovie",
      releaseDate: "releasedatemovie",
      categoryId: "idcategory2",
      rating: 0,
    },
    {
      id: "idmovie2",
      title: "titlemovie",
      description: "descriptionmovie",
      poster: "postermovie",
      releaseDate: "releasedatemovie",
      categoryId: "idcategory2",
      rating: 0,
    },
  ],
};

const editmovie: Movie = {
  id: "idmovie1",
  title: "titlemovieEDITED",
  description: "descriptionmovieEDITED",
  poster: "postermovieEDITED",
  releaseDate: "releasedatemovieEDITED",
  rating: 3,
  categoryId: "idcategory2",
};

const movieadd: Movie = {
  id: "idmovie3",
  title: "titlemovie",
  description: "descriptionmovie",
  poster: "postermovie",
  releaseDate: "releasedatemovie",
  categoryId: "idcategory2",
  rating: 0,
};

const deletemovie: string = "idmovie3";

test("getmoviesTest", async () => {
  let list: Movie[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...movielist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    }
  });
  const { result } = renderHook(useMovies);
  await waitFor(() => {
    expect(result.current.movies).toHaveLength(2);
  });
});

test("editmovieTest", async () => {
  let list: Movie[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...movielist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "PATCH") {
      console.log("patch");
      const index = movielist.data.findIndex((x) => x.id === editmovie.id);
      if (index !== -1) {
        movielist.data[index] = editmovie;
        list = [...movielist.data];
        return true;
      } else return false;
    }
  });
  const { result } = renderHook(() => useMovies("tokenstring"));

  expect(result.current.movies).toStrictEqual([]);

  await waitFor(async () => {
    expect(result.current.movies).toHaveLength(2);
  });

  await act(async () => {
    result.current.editMovie(editmovie);
  });

  await waitFor(async () => {
    expect(result.current.movies).toHaveLength(2);
    expect(result.current.movies[0].title).toBe("titlemovieEDITED");
  });
});

test("addmovieTest", async () => {
  let list: Movie[] = [];

  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...movielist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "POST") {
      console.log("post");
      movielist.data.push(movieadd);
      list = [...movielist.data];
      return true;
    }
  });

  const { result } = renderHook(() => useMovies("tokenstring"));

  expect(result.current.movies).toStrictEqual([]);

  await waitFor(async () => {
    expect(result.current.movies).toHaveLength(2);
  });

  await act(async () => {
    result.current.addMovie(movieadd);
  });

  await waitFor(async () => {
    expect(result.current.movies).toHaveLength(3);
  });
});

test("deletemovieTest", async () => {
  let list: Movie[] = [];

  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...movielist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "DELETE") {
      console.log("delete");
      const index = movielist.data.findIndex((x) => x.id === deletemovie);
      if (index !== -1) {
        movielist.data.splice(index, 1);
        list = [...movielist.data];
        return true;
      } else return false;
    }
  });

  const { result } = renderHook(() => useMovies("tokenstring"));

  expect(result.current.movies).toStrictEqual([]);

  await waitFor(async () => {
    expect(result.current.movies).toHaveLength(3);
  });

  await act(async () => {
    result.current.deleteMovie(deletemovie);
  });

  await waitFor(async () => {
    expect(result.current.movies).toHaveLength(2);
  });
});
