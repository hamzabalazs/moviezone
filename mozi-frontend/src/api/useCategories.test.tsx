import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { Category } from "./types";
import { useCategories } from "./useCategories";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const categorylist = {
  data: [
    {
      id: "idC1",
      name: "categoryname1",
    },
    {
      id: "idC2",
      name: "categoryname2",
    },
    {
      id: "idC3",
      name: "categoryname3",
    },
    {
      id: "idC4",
      name: "categoryname4",
    },
  ],
};

const editcategory: Category = {
  id: "idC3",
  name: "categorynameEDITED",
};

const addcategory: Category = {
  id: "idC5",
  name: "categoryname5ADDED",
};

const deletecategory: string = "idC2";

test("getcategoriesTest", async () => {
  let list: Category[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...categorylist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    }
  });
  const { result } = renderHook(() => useCategories("tokenstring"));

  expect(result.current.categories).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.categories).toHaveLength(4);
  });
});

test("editcategoriesTest", async () => {
  let list: Category[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...categorylist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "PATCH") {
      console.log("patch");
      const index = categorylist.data.findIndex(
        (x) => x.id === editcategory.id
      );
      if (index !== -1) {
        categorylist.data[index] = editcategory;
        list = [...categorylist.data];
        return true;
      } else return false;
    }
  });
  const { result } = renderHook(() => useCategories("tokenstring"));

  expect(result.current.categories).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.categories).toHaveLength(4);
  });

  await act(async () => {
    result.current.editCategory(editcategory);
  });

  await waitFor(() => {
    expect(result.current.categories).toHaveLength(4);
    expect(result.current.categories[2].name).toBe("categorynameEDITED");
  });
});

test("addcategoriesTest", async () => {
  let list: Category[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...categorylist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "POST") {
      console.log("post");
      categorylist.data.push(addcategory);
      list = [...categorylist.data];
      return true;
    }
  });
  const { result } = renderHook(() => useCategories("tokenstring"));

  expect(result.current.categories).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.categories).toHaveLength(4);
  });

  await act(async () => {
    result.current.addCategory(addcategory);
  });

  await waitFor(() => {
    expect(result.current.categories).toHaveLength(5);
    expect(result.current.categories[4].name).toBe("categoryname5ADDED");
  });
});

test("deletecategoriesTest", async () => {
  let list: Category[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...categorylist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "DELETE") {
      console.log("patch");
      const index = categorylist.data.findIndex((x) => x.id === deletecategory);
      if (index !== -1) {
        categorylist.data.splice(index, 1);
        list = [...categorylist.data];
        return true;
      } else return false;
    }
  });
  const { result } = renderHook(() => useCategories("tokenstring"));

  expect(result.current.categories).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.categories).toHaveLength(5);
  });

  await act(async () => {
    result.current.deleteCategory(deletecategory);
  });

  await waitFor(() => {
    expect(result.current.categories).toHaveLength(4);
  });
});
