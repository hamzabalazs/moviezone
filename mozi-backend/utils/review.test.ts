import { typeDefs } from "../Schema/TypeDefs";
import { resolvers } from "../Schema/Resolvers";
import { createDatabase, fillDatabase } from "../test/createDatabase";
import { ApolloServer } from "apollo-server";
import { Review } from "./types";
import {
  CREATE_REVIEW,
  DELETE_REVIEW,
  GET_REVIEWS,
  GET_REVIEWS_OF_USER_FOR_MOVIE,
  GET_REVIEW_BY_ID,
  UPDATE_REVIEW,
} from "../test/Query_Review";

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



const testReviewEdit = {
  id: "idR1",
  description: "Looked good",
  rating: "5",
  movie: {
    id: "idM1",
    title: "title1",
    description: "description1",
    poster: "poster1",
    release_date: "20/12/2020",
    category: {
      id: "idC2",
      name: "name2",
    },
    rating: "5",
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
};

const testReviewDelete = {
  id: "idR7",
  description: "badbad",
  rating: "1",
  movie: {
    id: "idM2",
    title: "title2",
    description: "description2",
    poster: "poster2",
    release_date: "30/06/2015",
    category: {
      id: "idC1",
      name: "name1",
    },
    rating: "1",
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
}

const testReviewDelete2 = {
  id: "idR2",
  description: "Was alright",
  rating: "3",
  movie: {
    id: "idM3",
    title: "title3",
    description: "description3",
    poster: "poster3",
    release_date: "25/09/2000",
    category: {
      id: "idC1",
      name: "name1",
    },
    rating: "3.5",
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
}

const editReview = {
  id: "idR1",
  description: "Looked BAD XP",
  rating: "1",
  movie: {
    id: "idM1",
    title: "title1",
    description: "description1",
    poster: "poster1",
    release_date: "20/12/2020",
    category: {
      id: "idC2",
      name: "name2",
    },
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
};

const editReview2 = {
  id: "idR1",
  description: "Looked better edit2",
  rating: "3",
  movie: {
    id: "idM1",
    title: "title1",
    description: "description1",
    poster: "poster1",
    release_date: "20/12/2020",
    category: {
      id: "idC2",
      name: "name2",
    },
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
}

const deleteReview2 = {
  id: "idR2",
  description: "Was alright",
  rating: "3",
  movie: {
    id: "idM3",
    title: "title3",
    description: "description3",
    poster: "poster3",
    release_date: "25/09/2000",
    category: {
      id: "idC1",
      name: "name1",
    },
  },

  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
};

const deleteReview = {
  id: "idR7",
  description: "badbad",
  rating: "1",
  movie: {
    id: "idM2",
    title: "title2",
    description: "description2",
    poster: "poster2",
    release_date: "30/06/2015",
    category: {
      id: "idC1",
      name: "name1",
    },
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
}

const addReview = {
  rating: "3",
  description: "Awesome ADD",
  movie_id: "idM6",
  user_id: "idU4",
};

const badAddReview = {
  rating: "2",
  description: "notgonnawork",
  movie_id: "idM3",
  user_id: "idU1",
};

test("Should get all reviews", async () => {
  await fillDatabase(db);
  const result = await server.executeOperation({
    query: GET_REVIEWS,
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.getReviews).toHaveLength(7);
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
  const result = await server.executeOperation({
    query: CREATE_REVIEW,
    variables: {
      input: {
        ...badAddReview,
      },
    },
  });
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
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
});
test("Should not add review if movie does not exist ( bad ID )", async () => {
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
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
});
test("Should not add review if user does not exist ( bad ID )", async () => {
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
  expect(result.errors).not.toBeUndefined();
  expect(result.data).toBeNull();
});
test("Should add review if user and movie exists, and movie has not been rated by user", async () => {
    const beforeResult = await server.executeOperation({
        query: GET_REVIEWS
    })
    expect(beforeResult.errors).toBeUndefined()
    expect(beforeResult.data?.getReviews).toHaveLength(7)
  
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
    query: GET_REVIEWS
})
expect(afterResult.errors).toBeUndefined()
expect(afterResult.data?.getReviews).toHaveLength(8)
});
test("Should not edit review if user does not own said review",async() => {
  req.headers['auth-token'] = "tokenviewer4321"
  const result = await server.executeOperation({
    query:UPDATE_REVIEW,
    variables:{input:{
      id:testReviewEdit.id,
      description:editReview.description,
      rating:editReview.rating
    }}
  })
  expect(result.errors).not.toBeUndefined()
  expect(result.data).toBeNull()
})
test("Should not edit review if no token is provided",async() => {
  req.headers['auth-token'] = ""
  const result = await server.executeOperation({
    query:UPDATE_REVIEW,
    variables:{input:{
      id:testReviewEdit.id,
      description:editReview.description,
      rating:editReview.rating
    }}
  })
  expect(result.errors).not.toBeUndefined()
  expect(result.data).toBeNull()
})
test("Should not edit review if review does not exist ( bad ID )",async() => {
  req.headers['auth-token'] = "admintoken1423"
  const result = await server.executeOperation({
    query:UPDATE_REVIEW,
    variables:{input:{
      id:"badID",
      description:editReview.description,
      rating:editReview.rating
    }}
  })
  expect(result.errors).not.toBeUndefined()
  expect(result.data).toBeNull()
})
test("Should edit review if user owns said review",async() => {
  req.headers['auth-token'] = "viewertoken1234"
  const result = await server.executeOperation({
    query:UPDATE_REVIEW,
    variables:{input:{
      id:testReviewEdit.id,
      description:editReview.description,
      rating:editReview.rating
    }}
  })
  expect(result.errors).toBeUndefined()
  expect(result.data?.updateReview).toEqual(editReview)
})//before after
test("Should edit review if user does not own review,but is admin/editor",async() => {
  req.headers['auth-token'] = "admintoken1423"
  const result = await server.executeOperation({
    query:UPDATE_REVIEW,
    variables:{input:{
      id:testReviewEdit.id,
      description:editReview2.description,
      rating:editReview2.rating
    }}
  })
  expect(result.errors).toBeUndefined()
  expect(result.data?.updateReview).toEqual(editReview2)
})//before after
test("Should not delete review if user does not own said review",async() => {
  req.headers['auth-token'] = "tokenviewer4321"
  const result = await server.executeOperation({
    query:DELETE_REVIEW,
    variables:{input:{
      id:testReviewDelete.id,
    }}
  })
  expect(result.errors).not.toBeUndefined()
  expect(result.data).toBeNull()
})
test("Should not delete review if no token is provided",async() => {
  req.headers['auth-token'] = ""
  const result = await server.executeOperation({
    query:DELETE_REVIEW,
    variables:{input:{
      id:testReviewDelete.id,
    }}
  })
  expect(result.errors).not.toBeUndefined()
  expect(result.data).toBeNull()
})
test("Should not delete review if review does not exist ( bad ID )",async() => {
  req.headers['auth-token'] = "admintoken1423"
  const result = await server.executeOperation({
    query:DELETE_REVIEW,
    variables:{input:{
      id:"badID",
    }}
  })
  expect(result.errors).not.toBeUndefined()
  expect(result.data).toBeNull()
})
test("Should delete review if user does own said review",async() => {
  const beforeResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables:{input:{
      id:testReviewDelete.id
    }}
  })
  expect(beforeResult.errors).toBeUndefined()
  expect(beforeResult.data?.getReviewById).toEqual(testReviewDelete)
  req.headers['auth-token'] = "viewertoken1234"
  const result = await server.executeOperation({
    query:DELETE_REVIEW,
    variables:{input:{
      id:testReviewDelete.id,
    }}
  })
  expect(result.errors).toBeUndefined()
  expect(result.data?.deleteReview).toEqual(deleteReview)

  const afterResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables:{input:{
      id:testReviewDelete.id
    }}
  })
  expect(afterResult.errors).not.toBeUndefined()
  expect(afterResult.data).toBeNull()
})
test("Should delete review if user does not own review,but is admin/editor",async() => {
  const beforeResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables:{input:{
      id:testReviewDelete2.id
    }}
  })
  expect(beforeResult.errors).toBeUndefined()
  expect(beforeResult.data?.getReviewById).toEqual(testReviewDelete2)

  req.headers['auth-token'] = "admintoken1423"
  const result = await server.executeOperation({
    query:DELETE_REVIEW,
    variables:{input:{
      id:testReviewDelete2.id,
    }}
  })
  expect(result.errors).toBeUndefined()
  expect(result.data?.deleteReview).toEqual(deleteReview2)

  const afterResult = await server.executeOperation({
    query: GET_REVIEW_BY_ID,
    variables:{input:{
      id:testReviewDelete2.id
    }}
  })
  expect(afterResult.errors).not.toBeUndefined()
  expect(afterResult.data).toBeNull()
})