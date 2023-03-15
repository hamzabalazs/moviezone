import React from "react";
import { gql, useMutation } from "@apollo/client";
import { CurrUser, User } from "../types";
import { useNavigate } from "react-router-dom";

export type LogInData = {
  user?: CurrUser;
  logIn: (
    email: string,
    password: string
  ) => Promise<User | undefined | string>;
  logOut: () => void;
  hasRole: (role: User["role"]) => boolean;
};

const LOGIN = gql`
  mutation LogIn($input: LoginInput!) {
  logIn(input: $input) {
    id
    first_name
    last_name
    role
    email
    token
  }
}
`;

const USER_KEY = "user-info";
const TOKEN_KEY = "token";

export function useLogIn(): LogInData {
  const [user, setUser] = React.useState<CurrUser | undefined>(
    getPersistedUser()
  );
  const navigate = useNavigate();
  const [LoginAPI] = useMutation(LOGIN);

  async function logIn(
    email: string,
    password: string
  ): Promise<User | string> {
    try {
      const loggedUser = await LoginAPI({
        variables: { input: { email, password } },
      });
      const token = loggedUser.data.logIn.token;
      setUser(loggedUser.data.logIn);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(loggedUser.data.logIn)
      );
      localStorage.setItem(TOKEN_KEY, token);
      return loggedUser.data.logIn;
    } catch (error: any) {
      console.log(error.message)
      return error.message;
    }
  }

  function logOut(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(undefined);
    navigate("/login");
  }

  function hasRole(role: User["role"]): boolean {
    if (role === "admin") return user?.role === "admin";
    if (role === "editor")
      return user?.role === "admin" || user?.role === "editor";

    return Boolean(user);
  }

  return {
    user,
    logIn,
    logOut,
    hasRole,
  };
}

export function getPersistedUser(): CurrUser | undefined {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) return JSON.parse(storedUser);
  } catch (err) {}
}
