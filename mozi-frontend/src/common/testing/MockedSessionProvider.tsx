import React from "react";
import { sessionContext, SessionContextData } from "../../auth/SessionContext";
import { useLogIn } from "../../auth/useLogIn";
import { UserRole } from "../../gql/graphql";

export function MockedSessionContext({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: Partial<SessionContextData>;
}): JSX.Element {
  const { logIn } = useLogIn()
  return (
    <sessionContext.Provider
      //@ts-ignore
      value={{
        //ADMIN USER
        user: {
          id: "idU1",
          first_name: "admin",
          last_name: "admin",
          email: "admin@example.com",
          role: UserRole["Admin"],
          token: "token1",
        },
        // logOut:jest.fn(),
        logIn,
        ...value,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
}
