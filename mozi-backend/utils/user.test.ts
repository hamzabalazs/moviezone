import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { FullUser, User, UserRole } from "./types";
import { CREATE_USER, DELETE_USER, GET_CURRENT_USER, GET_USERS, GET_USER_BY_EMAIL, GET_USER_BY_ID, UPDATE_USER } from "../test/Query_User";

const db = createDatabase();
let req = {
    headers:{
        'auth-token':""
    }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    return { db, req };
  },
});
const viewerRole=UserRole["viewer"]
const editorRole=UserRole["editor"]

const adminUser:Omit<User,"role"> & {role:string} = {
    id:"idU3",
    first_name: "Test",
    last_name:"User3",
    email:"testuser3@gmail.com",
    role:"admin"
}

const testUser:Omit<FullUser,"role"> & {role:string} = {
    id:"idU1",
    first_name: "Test",
    last_name:"User1",
    email:"testuser1@gmail.com",
    password:"testtest1",
    role:"viewer"
}

const testResponseUser:Omit<User,"role"> & {role:string} = {
    id:"idU1",
    first_name: "Test",
    last_name:"User1",
    email:"testuser1@gmail.com",
    role:"viewer"
}

const editUser:Omit<FullUser,"role"> & {role:string} = {
    id:"idU1",
    first_name: "EDITED",
    last_name:"User1EDIT",
    email:"EDITEDuser1@gmail.com",
    password:"EDITEDPASS",
    role:"editor"
}

const editResponseUser:Omit<User,"role"> & {role:string} = {
    id:"idU1",
    first_name: "EDITED",
    last_name:"User1EDIT",
    email:"EDITEDuser1@gmail.com",
    role:"editor"
}

const deleteUser:Omit<User,"role"> & {role:string} = {
    id:"idU1",
    first_name: "EDITED",
    last_name:"User1EDIT",
    email:"EDITEDuser1@gmail.com",
    role:"editor"
}

const addUser = {
    first_name: "Test",
    last_name:"User5",
    email:"testuser5@gmail.com",
    password:"testtest5"
}

test("Should get all users",async() => {
    await fillDatabase(db)
    const result = await server.executeOperation({
        query:GET_USERS
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.getUsers).toHaveLength(4)
})

test("Should get user if ID is correct",async() => {
    const result = await server.executeOperation({
        query:GET_USER_BY_ID,
        variables:{input:{
            id:testUser.id,
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.getUserById).toEqual(testResponseUser)
})

test("Should not get user if ID is incorrect",async() => {
    const result = await server.executeOperation({
        query:GET_USER_BY_ID,
        variables:{input:{
            id:"badID",
        }}
    })
    expect(result.errors).not.toBeUndefined()
    expect(result.data).toBeNull()
})

test("Should get user if email is correct",async() => {
    const result = await server.executeOperation({
        query:GET_USER_BY_EMAIL,
        variables:{input:{
            email:testUser.email,
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.checkForUser).toEqual(testResponseUser)
})

test("Should not get user if ID is incorrect",async() => {
    const result = await server.executeOperation({
        query:GET_USER_BY_EMAIL,
        variables:{input:{
            email:"badEmail",
        }}
    })
    expect(result.errors).not.toBeUndefined()
    expect(result.data).toBeNull()
})

test("Should get current user if token is given",async() => {
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:GET_CURRENT_USER
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.getCurrentUser).toEqual(adminUser)
})

test("Should not get current user if token is not given",async() => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query:GET_CURRENT_USER
    })
    expect(result.errors).not.toBeUndefined()
    expect(result.data).toBeNull()
})

test("Should add user",async() => {
    const result = await server.executeOperation({
        query:CREATE_USER,
        variables:{input:{
            ...addUser
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data).not.toBeNull()
})


test("Should not edit user, if bad token is given", async() => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query:UPDATE_USER,
        variables:{input:{
            ...editUser
        }}
    })
    expect(result.errors).not.toBeUndefined()
    expect(result.data).toBeNull()
})

test("Should not edit user, if user does not exist ( bad ID )", async() => {
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:UPDATE_USER,
        variables:{input:{
            id:"badID",
            first_name:editUser.first_name,
            last_name:editUser.last_name,
            email:editUser.email,
            password:editUser.password,
            role:editUser.role
        }}
    })
    expect(result.errors).not.toBeUndefined()
    expect(result.data).toBeNull()
})

test("Should edit user if token and ID is good",async() => {
    const beforeResult = await server.executeOperation({
        query:GET_USER_BY_ID,
        variables:{input:{
            id:testUser.id,
        }}
    })
    expect(beforeResult.errors).toBeUndefined()
    expect(beforeResult.data?.getUserById).toEqual(testResponseUser)
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:UPDATE_USER,
        variables:{input:{
            ...editUser
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.updateUser).toEqual(editResponseUser)
    const afterResult = await server.executeOperation({
        query:GET_USER_BY_ID,
        variables:{input:{
            id:testUser.id,
        }}
    })
    expect(afterResult.errors).toBeUndefined()
    expect(afterResult.data?.getUserById).toEqual(editResponseUser)
})

test("Should not delete user if bad token is given",async() => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query:DELETE_USER,
        variables:{input:{
            id:deleteUser.id
        }}
    })
    expect(result.errors).not.toBeUndefined()
    expect(result.data).toBeNull()
})

test("Should not delete user if user does not exist ( bad ID )",async() => {
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:DELETE_USER,
        variables:{input:{
            id:"badID"
        }}
    })
    expect(result.errors).not.toBeUndefined()
    expect(result.data).toBeNull()
})

test("Should delete user if token and ID is good",async() => {
    const beforeResult = await server.executeOperation({
        query:GET_USERS,
    })
    expect(beforeResult.errors).toBeUndefined()
    expect(beforeResult.data?.getUsers).toHaveLength(5)
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:DELETE_USER,
        variables:{input:{
            id:deleteUser.id
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.deleteUser).toEqual(deleteUser)
    const afterResult = await server.executeOperation({
        query:GET_USERS,
    })
    expect(afterResult.errors).toBeUndefined()
    expect(afterResult.data?.getUsers).toHaveLength(4)
})

