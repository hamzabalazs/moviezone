import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { fillDatabase } from "../test/createDatabase";
import { ApolloServer, gql } from "apollo-server";
import { addUser, adminUser, deleteUser, editResponseUser, editResponseUser2, editUser, editUser2, testResponseUser, testResponseUser2, testUser, testUser2 } from "./user.mocks";
import { EXPIRED_TOKEN_MESSAGE, NO_TOKEN_MESSAGE, NO_USER_MESSAGE, UNAUTHORIZED_MESSAGE, USER_EMAIL_USED_MESSAGE } from "../common/errorMessages";
import { userData } from "../test/mockedData";
import { Database } from "../common/sqlite-async-ts";
import { CREATE_USER, DELETE_USER, UPDATE_USER } from "../../mozi-frontend/src/users/useUser"

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      first_name
      last_name
      role
      email
    }
  }
`;
const GET_USER_BY_ID = gql`
  query GetUserById($input: UserInput!) {
    getUserById(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;
const GET_USER_BY_EMAIL = gql`
  query CheckForUser($input: UserEmailInput!) {
    checkForUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;
const GET_USER_BY_TOKEN = gql`
  query GetUserByToken {
    getUserByToken {
      id
      first_name
      last_name
      role
      email
      token
    }
  }
`;

let db:Database
let req = {
    headers:{
        'auth-token':"admintoken1423"
    }
}
let server:ApolloServer

test("Should open database",async() => {
  await Database.open(":memory:").then((_db:Database) => {
    db = _db
  })
  server = new ApolloServer({
    typeDefs,
    resolvers,
    context:async() => {
      return {db,req}
    }
  })
  await fillDatabase(db)
  expect(db).not.toBeUndefined()
})

test("Should get all users", async () => {
  
  const result = await server.executeOperation({
    query: GET_USERS,
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getUsers).toHaveLength(5);
});

test("Should get user if ID is correct", async () => {
  const result = await server.executeOperation({
    query: GET_USER_BY_ID,
    variables: {
      input: {
        id: testUser.id,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getUserById).toEqual(testResponseUser);
});

test("Should not get user if ID is incorrect", async () => {
  const result = await server.executeOperation({
    query: GET_USER_BY_ID,
    variables: {
      input: {
        id: "badID",
      },
    },
  });
  expect(result.data?.getUserById).toBeNull();
});

test("Should get user if email is correct", async () => {
  const result = await server.executeOperation({
    query: GET_USER_BY_EMAIL,
    variables: {
      input: {
        email: testUser.email,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.checkForUser).toEqual(testResponseUser);
});

test("Should not get user if email is incorrect", async () => {
  const result = await server.executeOperation({
    query: GET_USER_BY_EMAIL,
    variables: {
      input: {
        email: "badEmail",
      },
    },
  });
  expect(result.data?.checkForUser).toBeNull();
});

test("Should get current user if token is given", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: GET_USER_BY_TOKEN,
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getUserByToken).toEqual(adminUser);
});

test("Should not get current user if token is not given", async () => {
  req.headers["auth-token"] = "";
  const result = await server.executeOperation({
    query: GET_USER_BY_TOKEN,
  });
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
});

test("Should add user", async () => {
  const result = await server.executeOperation({
    query: CREATE_USER,
    variables: {
      input: {
        ...addUser,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data).not.toBeNull();
});

test("Should not edit user, if bad token is given", async () => {
  req.headers["auth-token"] = "";
  const result = await server.executeOperation({
    query: UPDATE_USER,
    variables: {
      input: {
        ...editUser,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit user, if user session has expired", async () => {
  req.headers["auth-token"] = "expiredToken";
  const result = await server.executeOperation({
    query: UPDATE_USER,
    variables: {
      input: {
        ...editUser,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit user, if user does not exist ( bad ID )", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: UPDATE_USER,
    variables: {
      input: {
        id: "badID",
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        email: editUser.email,
        password: editUser.password,
        role: editUser.role,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_USER_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit user, if user is not admin",async() => {
  req.headers["auth-token"] = "tokenviewer4321";
  const result = await server.executeOperation({
    query: UPDATE_USER,
    variables: {
      input: {
        ...editUser
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE);
  expect(result.data).toBeNull();
})

test("Should not edit user, if email is already in database",async() => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: UPDATE_USER,
    variables: {
      input: {
        id: editUser.id,
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        email: userData[2].email,
        password: editUser.password,
        role: editUser.role,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(USER_EMAIL_USED_MESSAGE);
  expect(result.data).toBeNull();
})



test("Should edit user if token and ID is good", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: UPDATE_USER,
    variables: {
      input: {
        ...editUser,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateUser).toEqual(editResponseUser);
});

test("Should edit user even if no role was given",async() => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: UPDATE_USER,
    variables: {
      input: {
        ...editUser2,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateUser).toEqual(editResponseUser2);
})

test("Should not delete user if bad token is given", async () => {
  req.headers["auth-token"] = "";
  const result = await server.executeOperation({
    query: DELETE_USER,
    variables: {
      input: {
        id: deleteUser.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not delete user if user session has expired", async () => {
  req.headers["auth-token"] = "expiredToken";
  const result = await server.executeOperation({
    query: DELETE_USER,
    variables: {
      input: {
        id: deleteUser.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not delete user if current user is not admin",async() => {
  req.headers["auth-token"] = "tokenviewer4321";
  const result = await server.executeOperation({
    query: DELETE_USER,
    variables: {
      input: {
        id: deleteUser.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE);
  expect(result.data).toBeNull();
})

test("Should not delete user if user does not exist ( bad ID )", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: DELETE_USER,
    variables: {
      input: {
        id: "badID",
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_USER_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should delete user if token and ID is good", async () => {
  const beforeResult = await server.executeOperation({
    query: GET_USERS,
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getUsers).toHaveLength(6);
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: DELETE_USER,
    variables: {
      input: {
        id: deleteUser.id,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.deleteUser).toEqual(deleteUser);
  const afterResult = await server.executeOperation({
    query: GET_USERS,
  });
  expect(afterResult.errors).toBeUndefined();
  expect(afterResult.data?.getUsers).toHaveLength(5);
});
