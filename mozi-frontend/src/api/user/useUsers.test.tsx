import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { User } from "../types";
import { useUsers } from "./useUsers";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const userlist: {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "admin" | "editor" | "viewer";
  }[];
} = {
  data: [
    {
      id: "idU1",
      firstName: "Hamza",
      lastName: "Balazs",
      email: "hamzabalazs99@gmail.com",
      password: "jelszo1234",
      role: "admin",
    },
    {
      id: "idU2",
      firstName: "test",
      lastName: "test2",
      email: "testtest99@gmail.com",
      password: "jelszo1234",
      role: "editor",
    },
    {
      id: "idU3",
      firstName: "Mittom",
      lastName: "En",
      email: "ionno99@gmail.com",
      password: "donno1234",
      role: "viewer",
    },
  ],
};

const edituser: User = {
  id: "idU2",
  firstName: "testEDITED",
  lastName: "test2EDITED",
  email: "testtest99@gmail.comEDITED",
  password: "jelszo1234EDITED",
  role: "admin",
};

const adduser: User = {
  id: "idU4",
  firstName: "testADDED",
  lastName: "testADDED",
  email: "testtest99@gmail.comADDED",
  password: "testADDED",
  role: "admin",
};

const deleteuser: string = "idU3";

test("getusersTest", async () => {
  let list: User[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...userlist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    }
  });
  const { result } = renderHook(() => useUsers("tokenstring"));

  expect(result.current.users).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.users).toHaveLength(3);
  });
});

test("editusersTest", async () => {
  let list: User[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...userlist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "PATCH") {
      console.log("patch");
      const index = userlist.data.findIndex((x) => x.id === edituser.id);
      if (index !== -1) {
        userlist.data[index] = edituser;
        list = [...userlist.data];
        return true;
      } else return false;
    }
  });
  const { result } = renderHook(() => useUsers("tokenstring"));

  expect(result.current.users).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.users).toHaveLength(3);
  });

  await act(async () => {
    result.current.editUser(edituser);
  });

  await waitFor(() => {
    expect(result.current.users).toHaveLength(3);
    expect(result.current.users[1].firstName).toBe("testEDITED");
  });
});

test("registerTest", async () => {
  let list: User[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...userlist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "POST") {
      console.log("post");
      userlist.data.push(adduser);
      list = [...userlist.data];
      return true;
    }
  });
  const { result } = renderHook(() => useUsers("tokenstring"));

  expect(result.current.users).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.users).toHaveLength(3);
  });

  await act(async () => {
    result.current.registerUser(adduser);
  });

  await waitFor(() => {
    expect(result.current.users).toHaveLength(4);
    expect(result.current.users[3].firstName).toBe("testADDED");
  });
});

test("deleteuserTest", async () => {
  let list: User[] = [];
  mockFetch.mockImplementation((input, init): any => {
    if (init?.method === "GET") {
      console.log("get");
      list = [...userlist.data];
      return {
        list: list,
        status: 200,
        json() {
          return { data: list };
        },
      };
    } else if (init?.method === "DELETE") {
      console.log("patch");
      const index = userlist.data.findIndex((x) => x.id === deleteuser);
      if (index !== -1) {
        userlist.data.splice(index, 1);
        list = [...userlist.data];
        return true;
      } else return false;
    }
  });
  const { result } = renderHook(() => useUsers("tokenstring"));

  expect(result.current.users).toHaveLength(0);
  await waitFor(() => {
    expect(result.current.users).toHaveLength(4);
  });

  await act(async () => {
    result.current.deleteUser(deleteuser);
  });

  await waitFor(() => {
    expect(result.current.users).toHaveLength(3);
  });
});
