import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { CREATE_USER } from "../test/Query_User";
import { GET_TOKEN } from "../test/Query_Session";
import { NO_USER_MESSAGE } from "../common/errorMessages";

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

test("Should not get token if user registered,but has not logged in yet", async () => {
  await fillDatabase(db);
  const userCreationResult = await server.executeOperation({
    query: CREATE_USER,
    variables: {
      input: {
        ...newTestUser,
      },
    },
  });
  expect(userCreationResult.errors).toBeUndefined();
  expect(userCreationResult.data).not.toBeNull();

  const id = userCreationResult.data?.createUser.id;
  const role = userCreationResult.data?.createUser.role;

  const result = await server.executeOperation({
    query: GET_TOKEN,
    variables: {
      input: {
        id,
        first_name: newTestUser.first_name,
        last_name: newTestUser.last_name,
        email: newTestUser.email,
        role,
      },
    },
  });
  expect(result.errors).not.toBeUndefined()
  expect(result.data).toBeNull();
});

