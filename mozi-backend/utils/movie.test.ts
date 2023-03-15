import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { Movie } from "./types";
import { CREATE_MOVIE, DELETE_MOVIE, GET_MOVIES, GET_MOVIE_BY_ID, UPDATE_MOVIE } from "../test/Query_Movie";

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

const testMovie:Movie = {
    id:"idM1",
    title:"title1",
    description:"description1",
    poster:"poster1",
    release_date:"20/12/2020",
    category:{
        id:"idC2",
        name:"name2"
    },
    rating:"5"
}

const editMovie = {
    id:"idM1",
    title:"title1EDITED",
    description:"description1ED",
    poster:"poster1ED",
    release_date:"20/12/2012",
    category_id:"idC3"
}

const editResponseMovie:Movie = {
    id:"idM1",
    title:"title1EDITED",
    description:"description1ED",
    poster:"poster1ED",
    release_date:"20/12/2012",
    category:{
        id:"idC3",
        name:"name3"
    },
    rating:"5"
}

const deleteMovie:Movie = {
    id:"idM3",
    title:"title3",
    description:"description3",
    poster:"poster3",
    release_date:"25/09/2000",
    category:{
        id:"idC1",
        name:"name1"
    },
    rating:"0"
}

const addMovie = {
    title:"newTitle",
    description:"newDescription",
    poster:"newPoster",
    release_date:"13/03/2023",
    category_id:"idC3"
}

test("Should get all movies",async() => {
    await fillDatabase(db)
    const result = await server.executeOperation({
        query:GET_MOVIES
    })
    expect(result.errors?.[0]?.extensions?.code).toEqual("Error")
    expect(result.data?.getMovies).toHaveLength(6)
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
    expect(result.errors).not.toBeUndefined()
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
    expect(result.errors).not.toBeUndefined()
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
    expect(result.errors).not.toBeUndefined()
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
    expect(result.errors).not.toBeUndefined()
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
    expect(result.errors).not.toBeUndefined()
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
    expect(result.errors).not.toBeUndefined()
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
    expect(result.errors).not.toBeUndefined()
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
    expect(result.errors).not.toBeUndefined()
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