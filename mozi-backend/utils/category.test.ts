import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { CREATE_CATEGORY, DELETE_CATEGORY, GET_CATEGORIES, GET_CATEGORY_BY_ID, GET_CATEGORY_BY_NAME, UPDATE_CATEGORY } from "../test/Query_Category";
import { addCategory, deleteCategory, editCategory, testCategory } from "./category.mocks";
import { CATEGORY_EXISTS_MESSAGE, NO_CATEGORY_MESSAGE, NO_TOKEN_MESSAGE, UNAUTHORIZED_MESSAGE } from "../common/errorMessages";
import { categoryData } from "../test/mockedData";

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



test("Should get all categories", async () => {
  await fillDatabase(db);
  const result = await server.executeOperation({
    query: GET_CATEGORIES,
  });
  expect(result.data?.getCategories).toHaveLength(3);
});

test("Should get category if ID is correct", async () => {
    const result = await server.executeOperation({
        query: GET_CATEGORY_BY_ID,
        variables:{input:{
            id: "idC2"
        }}
    })
    expect(result.data).not.toBeNull()
    expect(result.data?.getCategoryById.id).toBe("idC2")
})

test("Should reject if ID is incorrect",async() => {
    const result = await server.executeOperation({
        query: GET_CATEGORY_BY_ID,
        variables:{input:{
            id:"WrongID"
        }}
    })
    expect(result.data).toBeNull()
})

test("Should get category by name",async () => {
    const result = await server.executeOperation({
        query: GET_CATEGORY_BY_NAME,
        variables:{input:{
            name:testCategory.name
        }}
    })
    expect(result.data).not.toBeNull()
    expect(result.data?.checkForCategory).toEqual(testCategory)
})

test("Should not add new category if no token was given",async () => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query: CREATE_CATEGORY,
        variables:{input:{
            name: addCategory.name
        }}
    })
    expect(result.data).toBeNull();
    expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE)
})

test("Should not add new category if user is viewer",async() => {
    req.headers['auth-token'] = "viewertoken1234"
    const result = await server.executeOperation({
        query: CREATE_CATEGORY,
        variables:{input:{
            name: addCategory.name
        }}
    })
    expect(result.data).toBeNull();
    expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE)
})

test("Should add new category if good token was given",async() => {
    const beforeResult = await server.executeOperation({
        query: GET_CATEGORIES,
    })
    expect(beforeResult.data?.getCategories).toHaveLength(3)
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query: CREATE_CATEGORY,
        variables:{input:{
            name: addCategory.name
        }}
    })
    expect(result.data?.createCategory.name).toBe(addCategory.name)
    const afterResult = await server.executeOperation({
        query: GET_CATEGORIES,
    })
    expect(afterResult.data?.getCategories).toHaveLength(4)
})

test("Should not change category if no token was given",async() => {
    req.headers['auth-token'] = "";
    const result = await server.executeOperation({
        query: UPDATE_CATEGORY,
        variables:{input:{
            id:testCategory.id,
            name:editCategory.name,
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not change category if bad ID was given",async() => {
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query: UPDATE_CATEGORY,
        variables:{input:{
            id:"badID",
            name:"something not in categories"
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(NO_CATEGORY_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not change category if category already exists",async() =>{
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query: UPDATE_CATEGORY,
        variables:{input:{
            id:"newID",
            name:categoryData[1].name
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(CATEGORY_EXISTS_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not change category if user is viewer",async() => {
    req.headers['auth-token'] = "viewertoken1234"
    const result = await server.executeOperation({
        query: UPDATE_CATEGORY,
        variables:{input:{
            id:testCategory.id,
            name: editCategory.name
        }}
    })
    expect(result.data).toBeNull();
    expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE)
})

test("Should change category if good token was given",async() => {
    const beforeResult = await server.executeOperation({
        query: GET_CATEGORY_BY_ID,
        variables:{input:{
            id:testCategory.id,
        }}
    })
    expect(beforeResult.data?.getCategoryById).toEqual(testCategory)
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query: UPDATE_CATEGORY,
        variables:{input:{
            id:testCategory.id,
            name:editCategory.name,
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.updateCategory).toEqual(editCategory)
    const afterResult = await server.executeOperation({
        query: GET_CATEGORY_BY_ID,
        variables:{input:{
            id: testCategory.id,
        }}
    })
    expect(afterResult.data?.getCategoryById).toEqual(editCategory)

})

test("Should not delete category if no token was given",async() => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query: DELETE_CATEGORY,
        variables:{input:{
            id:testCategory.id,
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not delete category if bad ID was given",async() => {
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query: DELETE_CATEGORY,
        variables:{input:{
            id:"badID",
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(NO_CATEGORY_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not delete category if user is viewer",async() => {
    req.headers['auth-token'] = "viewertoken1234"
    const result = await server.executeOperation({
        query: DELETE_CATEGORY,
        variables:{input:{
            id:testCategory.id
        }}
    })
    expect(result.data).toBeNull();
    expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE)
})

test("Should delete category if good token was given",async() => {
    const beforeResult = await server.executeOperation({
        query: GET_CATEGORIES,
    })
    expect(beforeResult.data?.getCategories).toHaveLength(4)
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query: DELETE_CATEGORY,
        variables:{input:{
            id:deleteCategory.id,
        }}
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.deleteCategory).toEqual(deleteCategory)
    const afterResult = await server.executeOperation({
        query: GET_CATEGORIES,
    })
    expect(afterResult.data?.getCategories).toHaveLength(3)
})