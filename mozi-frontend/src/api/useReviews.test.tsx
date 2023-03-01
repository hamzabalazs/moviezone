import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { Review } from "./types";
import { useReviews } from "./useReviews";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const reviewlist = {
  data: [
    {
      id: "idC1",
      userId: "idU2",
      movieId: "idM2",
      description: "description1",
      rating: 3,
    },
    {
      id: "idC2",
      userId: "idU1",
      movieId: "idM2",
      description: "description2",
      rating: 3,
    },
    {
      id: "idC3",
      userId: "idU3",
      movieId: "idM2",
      description: "description3",
      rating: 3,
    },
    {
      id: "idC4",
      userId: "idU3",
      movieId: "idM2",
      description: "description4",
      rating: 3,
    },
  ],
};

const editreview: Review = {
  id: "idC1",
  userId: "idU2",
  movieId: "idM2",
  description: "description1EDITED",
  rating: 5,
};

const addreview: Review = {
  id: "idC5",
  userId: "idU3",
  movieId: "idM7",
  description: "description5ADDED",
  rating: 5,
};

const deletereview: string = "idC2";

test("getreviewsTest", async () => {
  let list: Review[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...reviewlist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    }
  });
  const { result } = renderHook(() => useReviews("tokenstring"));

  expect(result.current.reviews).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.reviews).toHaveLength(4);
  });
});

test("editreviewsTest", async () => {
  let list: Review[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...reviewlist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "PATCH") {
      console.log("patch");
      const index = reviewlist.data.findIndex((x) => x.id === editreview.id);
      if (index !== -1) {
        reviewlist.data[index] = editreview;
        list = [...reviewlist.data];
        return true;
      } else return false;
    }
  });
  const { result } = renderHook(() => useReviews("tokenstring"));

  expect(result.current.reviews).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.reviews).toHaveLength(4);
  });

  await act(async () => {
    result.current.editReview(editreview);
  });

  await waitFor(() => {
    expect(result.current.reviews).toHaveLength(4);
    expect(result.current.reviews[0].description).toBe("description1EDITED");
  });
});

test("addreviewsTest", async () => {
  let list: Review[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...reviewlist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "POST") {
      console.log("post");
      reviewlist.data.push(addreview);
      list = [...reviewlist.data];
      return true;
    }
  });
  const { result } = renderHook(() => useReviews("tokenstring"));

  expect(result.current.reviews).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.reviews).toHaveLength(4);
  });

  await act(async () => {
    result.current.addReview(addreview);
  });

  await waitFor(() => {
    expect(result.current.reviews).toHaveLength(5);
    expect(result.current.reviews[4].description).toBe("description5ADDED");
  });
});

test("deletereviewsTest", async () => {
  let list: Review[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...reviewlist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "DELETE") {
      console.log("patch");
      const index = reviewlist.data.findIndex((x) => x.id === deletereview);
      if (index !== -1) {
        reviewlist.data.splice(index, 1);
        list = [...reviewlist.data];
        return true;
      } else return false;
    }
  });
  const { result } = renderHook(() => useReviews("tokenstring"));

  expect(result.current.reviews).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.reviews).toHaveLength(5);
  });

  await act(async () => {
    result.current.deleteReview(deletereview);
  });

  await waitFor(() => {
    expect(result.current.reviews).toHaveLength(4);
  });
});
