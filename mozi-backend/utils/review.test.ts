import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { fillDatabase } from "../test/createDatabase";
import { ApolloServer, gql } from "apollo-server";
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
import { sessionData, userData } from "../test/mockedData";
import { Database } from "../common/sqlite-async-ts";
import { CREATE_REVIEW, DELETE_REVIEW, UPDATE_REVIEW } from "../../mozi-frontend/src/reviews/useReview";
import { GET_REVIEWS } from "../../mozi-frontend/src/reviews/useReviewsData";

const GET_REVIEW_BY_ID = gql`
  query GetReviewById($input: ReviewInput!) {
    getReviewById(input: $input) {
      id
      rating
      description
      movie {
        id
      }
      user {
        id
        first_name
        last_name
      }
    }
  }
`;

let db:Database
let req = {
    headers:{
        'auth-token':""
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

test("Should get all reviews of a user", async () => {
  const result = await server.executeOperation({
    query: GET_REVIEWS,
    variables:{
      input:{
        user_id: "idU1",
        limit:100,
        offset:0,
      },
      input2:{
        user_id:"idU1",
        movie_id:""
      }
    }
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getReviewsOfUser).toHaveLength(3);
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
  expect(result.data?.getReviewById).toBeNull();
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
    query: GET_REVIEWS,
    variables:{
      input:{
        user_id: "idU1",
        limit:100,
        offset:0,
      },
      input2:{
        user_id:"idU1",
        movie_id:""
      }
    }
  });
  expect(testResult.errors).toBeUndefined();
  expect(testResult.data?.getReviewsOfUser).toHaveLength(3);

  const result = await server.executeOperation({
    query: CREATE_REVIEW,
    variables: {
      input: {
        ...badAddReview,
      },
    },
  });
  expect(result.errors?.[0]?.message).toEqual(REVIEW_EXISTS_MESSAGE);
  expect(result.data!.createReview).toBeNull();
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
  expect(result.data!.createReview).toBeNull();
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
  expect(result.data!.createReview).toBeNull();
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
  expect(result.data!.createReview).toBeNull();
});

test("Should add review if user and movie exists, and movie has not been rated by user", async () => {
  req.headers['auth-token'] = "admintoken1423"
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
  expect(result.data!.updateReview).toBeNull();
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
  expect(result.data!.updateReview).toBeNull();
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
  expect(result.data!.updateReview).toBeNull();
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
  expect(result.data!.updateReview).toBeNull();
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

  const afterResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables: {
      input: {
        id: testReviewEdit.id,
      },
    },
  });
  expect(afterResult.errors).toBeUndefined();
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
  expect(afterResult.data?.getReviewById).toBeNull();
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
  expect(afterResult.data?.getReviewById).toBeNull();
});
