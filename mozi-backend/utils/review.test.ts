import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import {
  CREATE_REVIEW,
  DELETE_REVIEW,
  GET_REVIEWS,
  GET_REVIEWS_OF_MOVIE,
  GET_REVIEWS_OF_USER,
  GET_REVIEWS_OF_USER_FOR_MOVIE,
  GET_REVIEW_BY_ID,
  UPDATE_REVIEW,
} from "../test/Query_Review";
import {
  addReview,
  badAddReview,
  deleteReview,
  deleteReview2,
  editReview,
  editReview2,
  testReviewDelete,
  testReviewDelete2,
  testReviewEdit,
} from "./review.mocks";
import {
  EXPIRED_TOKEN_MESSAGE,
  NO_MOVIE_MESSAGE,
  NO_REVIEW_MESSAGE,
  NO_TOKEN_MESSAGE,
  NO_USER_MESSAGE,
  REVIEW_EXISTS_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../common/errorMessages";
import { movieData, sessionData, userData } from "../test/mockedData";
import { Database } from "../common/sqlite-async-ts";

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

test("Should get all reviews", async () => {
  req.headers['auth-token'] = "admintoken1423"
  const result = await server.executeOperation({
    query: GET_REVIEWS,
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getReviews).toHaveLength(7);
});

test("Should get all reviews of User", async () => {
  req.headers['auth-token'] = "admintoken1423"
  const result = await server.executeOperation({
    query: GET_REVIEWS_OF_USER,
    variables: { input: { user_id: userData[1].id } },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getReviewsOfUser).toHaveLength(3);
});

test("Should get all reviews of Movie", async () => {
  req.headers['auth-token'] = "admintoken1423"
  const result = await server.executeOperation({
    query: GET_REVIEWS_OF_MOVIE,
    variables: { input: { movie_id: movieData[1].id } },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getReviewsOfMovie).toHaveLength(2);
});

test("Should not get review if ID is invalid", async () => {
  const result = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: "BadID",
      },
    },
  });
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
});

test("Should get review if ID is valid", async () => {
  const result = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewEdit.id,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getReviewById).toEqual(testReviewEdit);
});

test("Should not add review if movie already rated by user", async () => {
  req.headers['auth-token'] = sessionData[0].token
  const testResult = await server.executeOperation({
    query: GET_REVIEWS_OF_USER_FOR_MOVIE,
    variables: {
      input: {
        user_id: badAddReview.user_id,
        movie_id: badAddReview.movie_id,
      },
    },
  });
  expect(testResult.errors).toBeUndefined();
  expect(testResult.data?.getReviewsOfUserForMovie).toHaveLength(1);

  const result = await server.executeOperation({
    query: CREATE_REVIEW,
    variables: {
      input: {
        ...badAddReview,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(REVIEW_EXISTS_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not add review if movie does not exist ( bad ID )", async () => {
  req.headers['auth-token'] = sessionData[3].token
  const result = await server.executeOperation({
    query: CREATE_REVIEW,
    variables: {
      input: {
        rating: addReview.rating,
        description: addReview.description,
        movie_id: "badID",
        user_id: addReview.user_id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_MOVIE_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not add review if user session has expired", async () => {
  req.headers['auth-token'] = "expiredToken"
  const result = await server.executeOperation({
    query: CREATE_REVIEW,
    variables: {
      input: {
        rating: addReview.rating,
        description: addReview.description,
        movie_id: "badID",
        user_id: addReview.user_id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not add review if user does not exist ( bad ID )", async () => {
  req.headers['auth-token'] = sessionData[3].token
  const result = await server.executeOperation({
    query: CREATE_REVIEW,
    variables: {
      input: {
        rating: addReview.rating,
        description: addReview.description,
        movie_id: addReview.movie_id,
        user_id: "badID",
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_USER_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should add review if user and movie exists, and movie has not been rated by user", async () => {
  req.headers['auth-token'] = "admintoken1423"
  const beforeResult = await server.executeOperation({
    query: GET_REVIEWS,
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getReviews).toHaveLength(7);

  const result = await server.executeOperation({
    query: CREATE_REVIEW,
    variables: {
      input: {
        ...addReview,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.createReview).not.toBeNull();

  const afterResult = await server.executeOperation({
    query: GET_REVIEWS,
  });
  expect(afterResult.errors).toBeUndefined();
  expect(afterResult.data?.getReviews).toHaveLength(8);
});

test("Should not edit review if user does not own said review", async () => {
  req.headers["auth-token"] = "tokenviewer4321";
  const result = await server.executeOperation({
    query: UPDATE_REVIEW,
    variables: {
      input: {
        id: testReviewEdit.id,
        description: editReview.description,
        rating: editReview.rating,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit review if no token is provided", async () => {
  req.headers["auth-token"] = "";
  const result = await server.executeOperation({
    query: UPDATE_REVIEW,
    variables: {
      input: {
        id: testReviewEdit.id,
        description: editReview.description,
        rating: editReview.rating,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit review if user session has expired", async () => {
  req.headers["auth-token"] = "expiredToken";
  const result = await server.executeOperation({
    query: UPDATE_REVIEW,
    variables: {
      input: {
        id: testReviewEdit.id,
        description: editReview.description,
        rating: editReview.rating,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not edit review if review does not exist ( bad ID )", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: UPDATE_REVIEW,
    variables: {
      input: {
        id: "badID",
        description: editReview.description,
        rating: editReview.rating,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_REVIEW_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should edit review if user owns said review", async () => {
  const beforeResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewEdit.id,
      },
    },
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getReviewById).toEqual(testReviewEdit);

  req.headers["auth-token"] = "viewertoken1234";
  const result = await server.executeOperation({
    query: UPDATE_REVIEW,
    variables: {
      input: {
        id: testReviewEdit.id,
        description: editReview.description,
        rating: editReview.rating,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateReview).toEqual(editReview);

  const afterResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewEdit.id,
      },
    },
  });
  expect(afterResult.errors).toBeUndefined();
  expect(afterResult.data?.getReviewById).toEqual(editReview);
});

test("Should edit review if user does not own review,but is admin/editor", async () => {
  const beforeResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewEdit.id,
      },
    },
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getReviewById).toEqual(editReview);

  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: UPDATE_REVIEW,
    variables: {
      input: {
        id: testReviewEdit.id,
        description: editReview2.description,
        rating: editReview2.rating,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateReview).toEqual(editReview2);

  const afterResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewEdit.id,
      },
    },
  });
  expect(afterResult.errors).toBeUndefined();
  expect(afterResult.data?.getReviewById).toEqual(editReview2);
});

test("Should not delete review if user does not own said review", async () => {
  req.headers["auth-token"] = "tokenviewer4321";
  const result = await server.executeOperation({
    query: DELETE_REVIEW,
    variables: {
      input: {
        id: testReviewDelete.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(UNAUTHORIZED_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not delete review if no token is provided", async () => {
  req.headers["auth-token"] = "";
  const result = await server.executeOperation({
    query: DELETE_REVIEW,
    variables: {
      input: {
        id: testReviewDelete.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not delete review if user session has expired", async () => {
  req.headers["auth-token"] = "expiredToken";
  const result = await server.executeOperation({
    query: DELETE_REVIEW,
    variables: {
      input: {
        id: testReviewDelete.id,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(EXPIRED_TOKEN_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should not delete review if review does not exist ( bad ID )", async () => {
  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: DELETE_REVIEW,
    variables: {
      input: {
        id: "badID",
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(NO_REVIEW_MESSAGE);
  expect(result.data).toBeNull();
});

test("Should delete review if user does own said review", async () => {
  const beforeResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewDelete.id,
      },
    },
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getReviewById).toEqual(testReviewDelete);
  req.headers["auth-token"] = "viewertoken1234";
  const result = await server.executeOperation({
    query: DELETE_REVIEW,
    variables: {
      input: {
        id: testReviewDelete.id,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.deleteReview).toEqual(deleteReview);

  const afterResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewDelete.id,
      },
    },
  });
  expect(afterResult.errors).not.toBeUndefined();
  expect(afterResult.data).toBeNull();
});

test("Should delete review if user does not own review,but is admin/editor", async () => {
  const beforeResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewDelete2.id,
      },
    },
  });
  expect(beforeResult.errors).toBeUndefined();
  expect(beforeResult.data?.getReviewById).toEqual(testReviewDelete2);

  req.headers["auth-token"] = "admintoken1423";
  const result = await server.executeOperation({
    query: DELETE_REVIEW,
    variables: {
      input: {
        id: testReviewDelete2.id,
      },
    },
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.deleteReview).toEqual(deleteReview2);

  const afterResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewDelete2.id,
      },
    },
  });
  expect(afterResult.errors).not.toBeUndefined();
  expect(afterResult.data).toBeNull();
});
