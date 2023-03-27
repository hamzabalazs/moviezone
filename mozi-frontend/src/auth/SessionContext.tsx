import React from "react";
import { LogInData, useLogIn } from "./useLogIn";

export type SessionContextData = LogInData;

export const sessionContext = React.createContext<
  SessionContextData | undefined
>(undefined);

export function useSessionContext(): SessionContextData {
  const context = React.useContext(sessionContext);
  if (!context) throw new Error("");
  return context;
}

export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const logInData = useLogIn();

  return (
    <sessionContext.Provider
      value={{
        ...logInData,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
}
