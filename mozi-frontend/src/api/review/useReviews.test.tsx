import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { Review } from "../types";
import { useReviews } from "./useReviews";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const role:"admin" | "editor" | "viewer" = "editor"

const reviewlist = {
  data: [
    {
      id: "idC1",
      user:{
        id:"idU2",
        first_name:"first2",
        last_name:"last2",
        email:"email2",
        role:role,
        password:"vivu2"
      } ,
      movie:{
        id:"idM2",
        title:"title2",
        description:"WAAA2",
        poster:"posterket2",
        release_date:"awuuu2",
        category:{
          id:"idC1",
          name:"name1"
        },
        rating:"0"
      } ,
      description: "description1",
      rating: "3",
    },
    {
      id: "idC2",
      user:{
        id:"idU1",
        first_name:"first1",
        last_name:"last1",
        email:"email1",
        role:role,
        password:"vivu1" 
      } ,
      movie:{
        id:"idM2",
        title:"title2",
        description:"WAAA2",
        poster:"posterket2",
        release_date:"awuuu2",
        category:{
          id:"idC1",
          name:"name1"
        },
        rating:"0"
      } ,
      description: "description2",
      rating: "3",
    },
    {
      id: "idC3",
      user:{
        id:"idU3",
        first_name:"first3",
        last_name:"last3",
        email:"email3",
        role:role,
        password:"vivu3"
      } ,
      movie:{
        id:"idM1",
        title:"title1",
        description:"WAAA1",
        poster:"posterket1",
        release_date:"awuuu1" ,
        category:{
          id:"idC1",
          name:"name1"
        },
        rating:"0"
      } ,
      description: "description3",
      rating: "3",
    },
    {
      id: "idC4",
      user:{
        id:"idU3",
        first_name:"first3",
        last_name:"last3",
        email:"email3",
        role:role,
        password:"vivu3"
      } ,
      movie:{
        id:"idM2",
        title:"title2",
        description:"WAAA2",
        poster:"posterket2",
        release_date:"awuuu2",
        category:{
          id:"idC1",
          name:"name1"
        },
        rating:"0"
      } ,
      description: "description4",
      rating: "3",
    },
  ],
};

const editreview: Review = {
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
    rating:"0"
  } ,
  description: "description1EDITED",
  rating: "5",
};

const addreview: Review = {
  id: "idC5",
  user:{
    id:"idU3",
    first_name:"first3",
    last_name:"last3",
    email:"email3",
    role:"viewer",
    password:"vivu3"
  } ,
  movie:{
    id:"idM7",
    title:"title7",
    description:"WAAA7",
    poster:"posterket7",
    release_date:"awuuu7",
    category:{
      id:"idC1",
      name:"name1"
    },
    rating:"0"
  } ,
  description: "description5ADDED",
  rating: "5",
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

// test("editreviewsTest", async () => {
//   let list: Review[] = [];
//   mockFetch.mockImplementation((input, init): any => {
//     if (init?.method === "GET") {
//       console.log("get");
//       list = [...reviewlist.data];
//       return {
//         list: list,
//         status: 200,
//         json() {
//           return { data: list };
//         },
//       };
//     } else if (init?.method === "PATCH") {
//       console.log("patch");
//       const index = reviewlist.data.findIndex((x) => x.id === editreview.id);
//       if (index !== -1) {
//         reviewlist.data[index] = editreview;
//         list = [...reviewlist.data];
//         return true;
//       } else return false;
//     }
//   });
//   const { result } = renderHook(() => useReviews("tokenstring"));

//   expect(result.current.reviews).toHaveLength(0);
//   await waitFor(() => {
//     expect(result.current.reviews).toHaveLength(4);
//   });

//   await act(async () => {
//     result.current.editReview(editreview);
//   });

//   await waitFor(() => {
//     expect(result.current.reviews).toHaveLength(4);
//     expect(result.current.reviews[0].description).toBe("description1EDITED");
//   });
// });

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
      //reviewlist.data.push(addreview);
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
    result.current.addReview(addreview.rating,addreview.description,addreview.id,addreview.user.id);
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
