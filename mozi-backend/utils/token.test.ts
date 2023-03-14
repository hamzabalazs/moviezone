import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { CREATE_USER, GET_USER_BY_EMAIL } from "../test/Query_User";
import { CREATE_TOKEN, GET_ROLE, GET_TOKEN } from "../test/Query_Session";

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

const hasTokenTestUser = {
  id: "idU1",
  first_name: "Test",
  last_name: "User1",
  email: "testuser1@gmail.com",
  password: "testtest1",
  role: "viewer",
};

const userNotExist = {
  id: "notExist",
  first_name: "Test232",
  last_name: "User122",
  email: "testuser343431@gmail.com",
  password: "testtest23423432",
  role: "viewer",
};

const newTestUser2 = {
  first_name: "Test2",
  last_name: "User2",
  email: "testuser@gmail.com2",
  password: "testtest22",
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
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
});
test("Should get token, if user has logged in before ( token was created already )", async () => {
  const result = await server.executeOperation({
    query: GET_TOKEN,
    variables: {
      input: {
        id: hasTokenTestUser.id,
        first_name: hasTokenTestUser.first_name,
        last_name: hasTokenTestUser.last_name,
        email: hasTokenTestUser.email,
        role: hasTokenTestUser.role,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data).not.toBeNull();
});
test("Should fail token creation if login was unsuccessful ( user does not exist )", async () => {
  const result = await server.executeOperation({
    query: CREATE_TOKEN,
    variables: {
      input: {
        email: userNotExist.email,
        password: userNotExist.password,
      },
    },
  });
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
});
test("Should create new token for freshly registered user, that just logged in", async () => {
  const userCreationResult = await server.executeOperation({
    query: CREATE_USER,
    variables: {
      input: {
        ...newTestUser2,
      },
    },
  });
  expect(userCreationResult.errors).toBeUndefined();
  expect(userCreationResult.data).not.toBeNull();
  const id = userCreationResult.data?.createUser.id;
  const role = userCreationResult.data?.createUser.role;

  const checkBeforeTokenResult = await server.executeOperation({
    query: GET_TOKEN,
    variables: {
      input: {
        id,
        first_name: newTestUser2.first_name,
        last_name: newTestUser2.last_name,
        email: newTestUser2.email,
        role,
      },
    },
  });
  expect(checkBeforeTokenResult.errors).not.toBeUndefined();
  expect(checkBeforeTokenResult.data).toBeNull();

  
  const result = await server.executeOperation({
    query: CREATE_TOKEN,
    variables: {
      input: {
        email: newTestUser2.email,
        password: newTestUser2.password,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data).not.toBeNull();
  const checkTokenResult = await server.executeOperation({
    query: GET_TOKEN,
    variables: {
      input: {
        id,
        first_name: newTestUser2.first_name,
        last_name: newTestUser2.last_name,
        email: newTestUser2.email,
        role,
      },
    },
  });
  expect(checkTokenResult.errors).toBeUndefined();
  expect(checkTokenResult.data).not.toBeNull();
});
test("Should not create new token for user that already has token", async () => {
  const getUserResult = await server.executeOperation({
    query:GET_USER_BY_EMAIL,
    variables:{input:{
        email:newTestUser2.email
    }}
  });
  console.log(getUserResult.data)
  expect(getUserResult.errors).toBeUndefined()
  expect(getUserResult.data).not.toBeNull()

  const id = getUserResult.data?.checkForUser.id
  const role = getUserResult.data?.checkForUser.role

  const getTokenResult = await server.executeOperation({
    query: GET_TOKEN,
    variables: {
      input: {
        id,
        first_name: newTestUser2.first_name,
        last_name: newTestUser2.last_name,
        email: newTestUser2.email,
        role,
      },
    },
  });
  expect(getTokenResult.errors).toBeUndefined();
  expect(getTokenResult.data).not.toBeNull();

  const token = getTokenResult.data?.getToken.token;

  const createTokenResult = await server.executeOperation({
    query: CREATE_TOKEN,
    variables: {
      input: {
        email: newTestUser2.email,
        password: newTestUser2.password,
      },
    },
  });
  expect(createTokenResult.errors).toBeUndefined();
  expect(createTokenResult.data).not.toBeNull();
  expect(createTokenResult.data?.createToken.token).toEqual(token);
});
test("Should not get role if no token is given",async() => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query:GET_ROLE,
        
    })
    expect(result.data).toBeNull()
    expect(result.errors).not.toBeUndefined()
})
test("Should not get role if user does not exist",async() => {
    req.headers['auth-token'] = "NotARealToken"
    const result = await server.executeOperation({
        query:GET_ROLE,
        
    })
    expect(result.data).toBeNull()
    expect(result.errors).not.toBeUndefined()
})
test("Should get role if token is valid",async() => {
    req.headers['auth-token'] = "viewertoken1234"
    const result = await server.executeOperation({
        query:GET_ROLE,
        
    })
    expect(result.data?.determineRole.role).toEqual("viewer")
    expect(result.errors).toBeUndefined()
})