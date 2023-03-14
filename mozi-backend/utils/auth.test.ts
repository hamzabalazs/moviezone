import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { LOGIN } from "../test/Query_Auth";
import { CREATE_USER } from "../test/Query_User";

const db = createDatabase();
let req = {
  headers: {
    "auth-token": "",
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    return { db, req };
  },
});

const newTestUser = {
  first_name: "Test",
  last_name: "User",
  email: "testuser@gmail.com",
  password: "testtest",
};

test("Should not login, if user does not exist", async () => {
  await fillDatabase(db);
  const result = await server.executeOperation({
    query: LOGIN,
    variables: {
      input: {
        email: newTestUser.email,
        password: newTestUser.password,
      },
    },
  });
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
});
test("Should not login, if user is registered,but password does not match", async () => {
  const registerResult = await server.executeOperation({
    query: CREATE_USER,
    variables: {
      input: {
        ...newTestUser,
      },
    },
  });
  expect(registerResult.errors).toBeUndefined();
  expect(registerResult.data?.createUser.email).toEqual(newTestUser.email);

  const result = await server.executeOperation({
    query: LOGIN,
    variables: {
      input: {
        email: newTestUser.email,
        password: "badPassword",
      },
    },
  });
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
});
test("Should login, if user exists and login details match",async() => {
    const result = await server.executeOperation({
        query: LOGIN,
        variables: {
          input: {
            email: newTestUser.email,
            password: newTestUser.password,
          },
        },
      });
      expect(result.errors).toBeUndefined();
      expect(result.data?.logIn.email).toEqual(newTestUser.email);
})
