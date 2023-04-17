import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { fillDatabase } from "../test/createDatabase";
import { ApolloServer, gql } from "apollo-server";
import {
  CREATE_MOVIE,
  DELETE_MOVIE,
  UPDATE_MOVIE,
  GET_MOVIE_BY_ID,
} from "../../mozi-frontend/src/movies/movieQueries";
import {
  addMovie,
  deleteMovie,
  editMovie,
  editResponseMovie,
  testMovie,
} from "./movie.mocks";
import {
  EXPIRED_TOKEN_MESSAGE,
  NO_MOVIE_MESSAGE,
  NO_TOKEN_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../common/errorMessages";
const mysql = require('mysql2')

const GET_MOVIES = gql`
  query GetMovies($input: MoviePaginationInput!) {
    getMovies(input: $input) {
      id
      title
      description
      poster
      release_date
      category {
        id
        name
      }
      rating
    }
  }
`;

let req = {
  headers: {
    "auth-token": "admintoken1423",
  },
};
let server: ApolloServer;

test("Should open database",async() => {
  const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:"jelszo1234",
    database:"moviezone_test"
  })
  server = new ApolloServer({
    typeDefs,
    resolvers,
    context:async() => {
      return {db,req}
    }
  })
  fillDatabase(db)
  expect(db).not.toBeUndefined()
  })

test("Should get all movies", async () => {
  const result = await server.executeOperation({
    query: GET_MOVIES,
    variables:{
      input:{
        limit:100,
        offset:0,
        category:[],
        searchField:"",
        orderByTitle:null,
        orderByCategory:null
      }
    }
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getMovies).toHaveLength(6);
});

test("Should not get movie, if ID is invalid", async () => {
  const result = await server.executeOperation({
    query: GET_MOVIE_BY_ID,
    variables: {
      input: {
        id: "badID",
      },
      input2: {
        movie_id: testMovie.id,
        limit:3,
        offset:0
      },
      input3:{
        movie_id: testMovie.id,
        user_id:""
      }
    },
  });
  expect(result.data?.getMovieById).toBeNull();
});

test("Should get movie,if ID is valid", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: GET_MOVIE_BY_ID,
    variables: {
      input: {
        id: testMovie.id,
      },
      input2: {
        movie_id: testMovie.id,
        limit:3,
        offset:0
      },
      input3:{
        movie_id: testMovie.id,
        user_id:""
      }
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getMovieById).toEqual(testMovie);
});

test("Should not add movie, if token is invalid", async () => {
  req.headers["auth-token"] = "";
  const result = await server.executeOperation({
    query: CREATE_MOVIE,
    variables: {
      input: {
        ...addMovie,
      },
    },
  });

  expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE);
  expect(result.data!.createMovie).toBeNull();
});

test("Should not add movie, if token is valid but not admin/editor", async () => {
  req.headers["auth-token"] = "viewertoken1234";
  const result = await server.executeOperation({
    query: CREATE_MOVIE,
    variables: {
      input: {
        ...addMovie,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE);
  expect(result.data!.createMovie).toBeNull();
});

test("Should not add movie, if token is valid but session has expired", async () => {
  req.headers["auth-token"] = "expiredToken";
  const result = await server.executeOperation({
    query: CREATE_MOVIE,
    variables: {
      input: {
        ...addMovie,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE);
  expect(result.data!.createMovie).toBeNull();
});

test("Should add movie, if token is valid and is admin/editor", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const beforeResult = await server.executeOperation({
    query: GET_MOVIES,
    variables:{
      input:{
        limit:100,
        offset:0,
        category:[],
        searchField:"",
        orderByTitle:null,
        orderByCategory:null
      }
    }
    
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getMovies).toHaveLength(6);
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: CREATE_MOVIE,
    variables: {
      input: {
        ...addMovie,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data).not.toBeNull();

  const afterResult = await server.executeOperation({
    query: GET_MOVIES,
    variables:{
      input:{
        limit:100,
        offset:0,
        category:[],
        searchField:"",
        orderByTitle:null,
        orderByCategory:null
      }
    }
  });
  expect(afterResult.errors).toBeUndefined();
  expect(afterResult.data?.getMovies).toHaveLength(7);
});

test("Should not edit movie, if token is invalid", async () => {
  req.headers["auth-token"] = "";
  const result = await server.executeOperation({
    query: UPDATE_MOVIE,
    variables: {
      input: {
        ...editMovie,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit movie, if token is valid, but not admin/editor", async () => {
  req.headers["auth-token"] = "viewertoken1234";
  const result = await server.executeOperation({
    query: UPDATE_MOVIE,
    variables: {
      input: {
        ...editMovie,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit movie, if token is valid, but session has expired", async () => {
  req.headers["auth-token"] = "expiredToken";
  const result = await server.executeOperation({
    query: UPDATE_MOVIE,
    variables: {
      input: {
        ...editMovie,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit movie, if movie does not exist ( bad ID )", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: UPDATE_MOVIE,
    variables: {
      input: {
        id: "badID",
        title: editMovie.title,
        description: editMovie.description,
        poster: editMovie.poster,
        release_date: editMovie.release_date,
        category_id: editMovie.category_id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_MOVIE_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should edit movie, if movie exists and token is valid and is admin/editor", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const beforeResult = await server.executeOperation({
    query: GET_MOVIE_BY_ID,
    variables: {
      input: {
        id: testMovie.id,
      },
      input2: {
        movie_id: testMovie.id,
        limit:3,
        offset:0
      },
      input3:{
        movie_id: testMovie.id,
        user_id:""
      }
    },
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getMovieById).toEqual(testMovie);

  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: UPDATE_MOVIE,
    variables: {
      input: {
        ...editMovie,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateMovie).toEqual(editResponseMovie);

  const afterResult = await server.executeOperation({
    query: GET_MOVIE_BY_ID,
    variables: {
      input: {
        id: testMovie.id,
      },
      input2: {
        movie_id: testMovie.id,
        limit:3,
        offset:0
      },
      input3:{
        movie_id: testMovie.id,
        user_id:""
      }
    },
  });
  expect(afterResult.errors).toBeUndefined();
  expect(afterResult.data?.getMovieById).toEqual(editResponseMovie);
});

test("Should not delete movie, if token is invalid", async () => {
  req.headers["auth-token"] = "";
  const result = await server.executeOperation({
    query: DELETE_MOVIE,
    variables: {
      input: {
        id: deleteMovie.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not delete movie, if token is valid, but not admin/editor", async () => {
  req.headers["auth-token"] = "viewertoken1234";
  const result = await server.executeOperation({
    query: DELETE_MOVIE,
    variables: {
      input: {
        id: deleteMovie.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not delete movie, if token is valid, but session has expired", async () => {
  req.headers["auth-token"] = "expiredToken";
  const result = await server.executeOperation({
    query: DELETE_MOVIE,
    variables: {
      input: {
        id: deleteMovie.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not delete movie, if movie does not exist ( bad ID )", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: DELETE_MOVIE,
    variables: {
      input: {
        id: "badID",
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_MOVIE_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should delete movie, if movie exists and token is valid and is admin/editor", async () => {
  const beforeResult = await server.executeOperation({
    query: GET_MOVIES,
    variables:{
      input:{
        limit:100,
        offset:0,
        category:[],
        searchField:"",
        orderByTitle:null,
        orderByCategory:null
      }
    }
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getMovies).toHaveLength(7);

  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: DELETE_MOVIE,
    variables: {
      input: {
        id: deleteMovie.id,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.deleteMovie).toEqual(deleteMovie);

  const afterResult = await server.executeOperation({
    query: GET_MOVIES,
    variables:{
      input:{
        limit:100,
        offset:0,
        category:[],
        searchField:"",
        orderByTitle:null,
        orderByCategory:null
      }
    }
  });
  expect(afterResult.errors).toBeUndefined();
  expect(afterResult.data?.getMovies).toHaveLength(6);
});
