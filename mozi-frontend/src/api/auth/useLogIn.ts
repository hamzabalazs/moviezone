import React from "react";
import { API_URL } from "../constants";
import { useQuery, gql, useMutation } from "@apollo/client";
import { CurrUser, User } from "../types";

export type LogInData = {
  user?: CurrUser;
  logIn: (email: string, password: string) => Promise<boolean>;
  logOut: () => void;
  hasRole: (role: User["role"]) => boolean;
};

const LOGIN = gql`
  mutation CreateToken($input: AddTokenInput!) {
    createToken(input: $input) {
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
  const [LoginAPI] = useMutation(LOGIN);

  async function logIn(email: string, password: string): Promise<boolean> {
    const loggedUser = await LoginAPI({
      variables: { input: { email, password } },
    });
    if (!loggedUser) return false;
    else {
      const token = loggedUser.data.createToken.token;
      setUser(loggedUser.data.createToken);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(loggedUser.data.createToken)
      );
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
      return true;
    }
  }

  function logOut(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(undefined);
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
