import React from "react";
import { baseUrl } from "../url";
import { CurrUser, User } from "./types";

export type LogInData = {
  user?: CurrUser;
  logIn: (email: string, password: string) => Promise<boolean>;
  logOut: () => void;
  hasRole: (role: User["role"]) => boolean;
};

const USER_KEY = "user-info";

export function useLogIn(): LogInData {
  const [user, setUser] = React.useState<CurrUser | undefined>(
    getPersistedUser()
  );

  async function logIn(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(baseUrl + "/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 200) {
        const res = await response.json();
        const token = res.data.token;
        const user = { ...res.data.user, token };
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        setUser(user);
        return true;
      }
    } catch (err) {}
    return false;
  }

  function logOut(): void {
    localStorage.removeItem(USER_KEY);
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

function getPersistedUser(): CurrUser | undefined {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) return JSON.parse(storedUser);
  } catch (err) {}
}
