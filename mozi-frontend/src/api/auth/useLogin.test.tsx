import { useLogIn } from "./useLogIn";
import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

global.fetch = jest.fn();

const userObj = {
  id: "YWRtaW4=",
  firstName: "admin",
  lastName: "admin",
  email: "admin@example.com",
  role: "admin",
};

afterEach(() => {
  jest.clearAllMocks();
});

const data = { data: { token: "tokenSTR", user: userObj } };

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

test("login test fail", async () => {
  mockFetch.mockResolvedValue({
    ok: false,
    status: 401,
  } as any);
  const { result } = renderHook(useLogIn);

  expect(result.current.user).toBe(undefined);

  act(() => {
    result.current.logIn("admin@example.com", "admin");
  });
  await waitFor(() => {
    expect(result.current.user).toBe(undefined);
  });
  expect(fetch).toHaveBeenCalledTimes(1);
});

test("login test success", async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  } as any);
  const { result } = renderHook(useLogIn);

  expect(result.current.user).toBe(undefined);

  act(() => {
    result.current.logIn("admin@example.com", "admin");
  });
  await waitFor(() => {
    expect(result.current.user?.email).toBe("admin@example.com");
  });
  expect(fetch).toHaveBeenCalledTimes(1);
  mockFetch.mockReset();
});

test("logout test success", async () => {
  const { result } = renderHook(useLogIn);

  expect(result.current.user).not.toBe(undefined);

  act(() => {
    result.current.logOut();
  });
  expect(result.current.user).toBe(undefined);
});
