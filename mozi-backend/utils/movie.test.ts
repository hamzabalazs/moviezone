import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { CREATE_MOVIE, DELETE_MOVIE, GET_MOVIES, GET_MOVIES_BY_CATEGORY, GET_MOVIE_BY_ID, UPDATE_MOVIE } from "../test/Query_Movie";
import { addMovie, deleteMovie, editMovie, editResponseMovie, testMovie} from "./movie.mocks";
import { EXPIRED_TOKEN_MESSAGE, NO_MOVIE_MESSAGE, NO_TOKEN_MESSAGE, UNAUTHORIZED_MESSAGE } from "../common/errorMessages";
import { categoryData } from "../test/mockedData";
import { Database } from "../common/sqlite-async-ts";
 
let db:Database
let req = {
    headers:{
        'auth-token':""
    }
}
let server:ApolloServer

test("Should get all movies",async() => {
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
    const result = await server.executeOperation({
        query:GET_MOVIES
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.getMovies).toHaveLength(6)
})

test("Should get all movies of a given category",async() => {
    const result = await server.executeOperation({
        query:GET_MOVIES_BY_CATEGORY,
        variables:{input:{category_id:categoryData[0].id}}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.getMoviesByCategoryId).toHaveLength(3)
})

test("Should not get movie, if ID is invalid",async() => {
    const result = await server.executeOperation({
        query:GET_MOVIE_BY_ID,
        variables:{input:{
            id:"badID"
        }}
    })
    expect(result.errors).not.toBeUndefined()
    expect(result.data).toBeNull()
})

test("Should get movie,if ID is valid",async() => {
    const result = await server.executeOperation({
        query:GET_MOVIE_BY_ID,
        variables:{input:{
            id:testMovie.id
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.getMovieById).toEqual(testMovie)
})

test("Should not add movie, if token is invalid",async() => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query:CREATE_MOVIE,
        variables:{input:{
            ...addMovie
        }}
    })
    
    expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not add movie, if token is valid but not admin/editor",async() => {
    req.headers['auth-token'] = "viewertoken1234"
    const result = await server.executeOperation({
        query:CREATE_MOVIE,
        variables:{input:{
            ...addMovie
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not add movie, if token is valid but session has expired",async() => {
    req.headers['auth-token'] = "expiredToken"
    const result = await server.executeOperation({
        query:CREATE_MOVIE,
        variables:{input:{
            ...addMovie
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should add movie, if token is valid and is admin/editor",async() => {
    const beforeResult = await server.executeOperation({
        query:GET_MOVIES
    })
    expect(beforeResult.errors).toBeUndefined()
    expect(beforeResult.data?.getMovies).toHaveLength(6)
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:CREATE_MOVIE,
        variables:{input:{
            ...addMovie
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data).not.toBeNull()

    const afterResult = await server.executeOperation({
        query:GET_MOVIES
    })
    expect(afterResult.errors).toBeUndefined()
    expect(afterResult.data?.getMovies).toHaveLength(7)
})

test("Should not edit movie, if token is invalid",async() => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query:UPDATE_MOVIE,
        variables:{input:{
            ...editMovie
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not edit movie, if token is valid, but not admin/editor",async() => {
    req.headers['auth-token'] = "viewertoken1234"
    const result = await server.executeOperation({
        query:UPDATE_MOVIE,
        variables:{input:{
            ...editMovie
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not edit movie, if token is valid, but session has expired",async() => {
    req.headers['auth-token'] = "expiredToken"
    const result = await server.executeOperation({
        query:UPDATE_MOVIE,
        variables:{input:{
            ...editMovie
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not edit movie, if movie does not exist ( bad ID )",async() => {
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:UPDATE_MOVIE,
        variables:{input:{
            id:"badID",
            title:editMovie.title,
            description:editMovie.description,
            poster:editMovie.poster,
            release_date:editMovie.release_date,
            category_id:editMovie.category_id
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(NO_MOVIE_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should edit movie, if movie exists and token is valid and is admin/editor",async() => {
    const beforeResult = await server.executeOperation({
        query:GET_MOVIE_BY_ID,
        variables:{input:{
            id:testMovie.id
        }}
    })
    expect(beforeResult.errors).toBeUndefined()
    expect(beforeResult.data?.getMovieById).toEqual(testMovie)
    
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:UPDATE_MOVIE,
        variables:{input:{
            ...editMovie
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.updateMovie).toEqual(editResponseMovie)

    const afterResult = await server.executeOperation({
        query:GET_MOVIE_BY_ID,
        variables:{input:{
            id:testMovie.id
        }}
    })
    expect(afterResult.errors).toBeUndefined()
    expect(afterResult.data?.getMovieById).toEqual(editResponseMovie)
})

test("Should not delete movie, if token is invalid",async() => {
    req.headers['auth-token'] = ""
    const result = await server.executeOperation({
        query:DELETE_MOVIE,
        variables:{input:{
            id:deleteMovie.id,
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not delete movie, if token is valid, but not admin/editor",async() => {
    req.headers['auth-token'] = "viewertoken1234"
    const result = await server.executeOperation({
        query:DELETE_MOVIE,
        variables:{input:{
            id:deleteMovie.id,
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not delete movie, if token is valid, but session has expired",async() => {
    req.headers['auth-token'] = "expiredToken"
    const result = await server.executeOperation({
        query:DELETE_MOVIE,
        variables:{input:{
            id:deleteMovie.id,
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should not delete movie, if movie does not exist ( bad ID )",async() => {
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:DELETE_MOVIE,
        variables:{input:{
            id:"badID",
        }}
    })
    expect(result.errors?.[0]?.message).toEqual(NO_MOVIE_MESSAGE)
    expect(result.data).toBeNull()
})

test("Should delete movie, if movie exists and token is valid and is admin/editor",async() => {
    const beforeResult = await server.executeOperation({
        query:GET_MOVIES
    })
    expect(beforeResult.errors).toBeUndefined()
    expect(beforeResult.data?.getMovies).toHaveLength(7)
    
    req.headers['auth-token'] = "admintoken1423"
    const result = await server.executeOperation({
        query:DELETE_MOVIE,
        variables:{input:{
            id:deleteMovie.id,
        }}
    })
    expect(result.errors).toBeUndefined()
    expect(result.data?.deleteMovie).toEqual(deleteMovie)

    const afterResult = await server.executeOperation({
        query:GET_MOVIES
    })
    expect(afterResult.errors).toBeUndefined()
    expect(afterResult.data?.getMovies).toHaveLength(6)
})