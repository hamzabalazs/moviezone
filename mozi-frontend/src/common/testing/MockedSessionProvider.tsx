import React from "react";
import { sessionContext, SessionContextData } from "../../auth/SessionContext";
import { UserRole } from "../../gql/graphql";

export function MockedSessionContext({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: Partial<SessionContextData>;
}): JSX.Element {
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
        ...value,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
}
