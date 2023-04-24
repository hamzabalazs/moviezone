import { createServer } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { LOGIN, existingTestUser, newTestUser } from "./auth.mocks";
import { NO_USER_MESSAGE } from "../common/errorMessages";

let req = {
  headers: {
    "auth-token": "admintoken1423",
  },
};
let con:{server:ApolloServer,db:any};

test("servercreation",async() => {
  con = await createServer(req);
})

test("Should not login, if user does not exist", async () => {
  const result = await con.server.executeOperation({
    query: LOGIN,
    variables: {
      input: {
        email: newTestUser.email,
        password: newTestUser.password,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_USER_MESSAGE);
  expect(result.data?.logIn).toBeUndefined();
});
test("Should login, if user exists and login details match",async() => {
    const result = await con.server.executeOperation({
        query: LOGIN,
        variables: {
          input: {
            email: existingTestUser.email,
            password: existingTestUser.password,
          },
        },
      });
      expect(result.errors).toBeUndefined();
      expect(result.data?.logIn.email).toEqual(existingTestUser.email);
})
