import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CurrentUser, LogInMutation, User } from "../../gql/graphql";

export type LogInData = {
  user?: CurrentUser;
  logIn: (
    email: string,
    password: string
  ) => Promise<CurrentUser | undefined | string>;
  logOut: () => void;
  hasRole: (role: User["role"]) => boolean;
};

export const LOGIN = gql`
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
  const [user, setUser] = React.useState<CurrentUser | undefined>(
    getPersistedUser()
  );
  const navigate = useNavigate();
  const [LoginAPI] = useMutation<LogInMutation>(LOGIN);

  async function logIn(
    email: string,
    password: string
  ): Promise<CurrentUser | string | undefined> {
    try {
      const loggedUser = await LoginAPI({
        variables: { input: { email, password } },
      });
      if(!loggedUser.data) return;
      const token = loggedUser.data.logIn.token;
      setUser(loggedUser.data.logIn);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(loggedUser.data.logIn)
      );
      if(token){
        localStorage.setItem(TOKEN_KEY, token);
      }
      return loggedUser.data.logIn;
    } catch (error: any) {
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

export function getPersistedUser(): CurrentUser | undefined {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) return JSON.parse(storedUser);
  } catch (err) {}
}
