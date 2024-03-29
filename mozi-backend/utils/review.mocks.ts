import { gql } from "apollo-server";

export const GET_REVIEW_BY_ID = gql`
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

export const GET_REVIEWS = gql`
  query getReviews(
    $input: GetReviewsOfUserInput!
    $input2: numOfReviewsInput!
  ) {
    getReviewsOfUser(input: $input) {
      id
      rating
      description
      movie {
        id
        title
        description
        poster
        release_date
        rating
        category {
          id
          name
        }
      }
      user {
        id
        first_name
        last_name
        role
        email
      }
    }
    getNumberOfReviewsOfUser(input: $input2) {
      totalCount
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: AddReviewInput!) {
    createReview(input: $input) {
      id
      rating
      description
      movie {
        id
        title
        description
        poster
        release_date
        rating
        category {
          id
          name
        }
      }
      user {
        id
        first_name
        last_name
        role
        email
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      id
      rating
      description
      movie {
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
      user {
        first_name
        last_name
        id
        role
        email
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      id
      rating
      description
      movie {
        id
        title
        description
        poster
        release_date
        rating
        category {
          id
          name
        }
      }
      user {
        id
        first_name
        last_name
        role
        email
      }
    }
  }
`;

export const testReviewEdit = {
  id: "idR1",
  description: "Looked good",
  rating: "5",
  movie: {
    id: "idM1",

  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
  },
};

export const testReviewDelete = {
  id: "idR7",
  description: "badbad",
  rating: "1",
  movie: {
    id: "idM2",
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
  },
};

export const testReviewDelete2 = {
  id: "idR2",
  description: "Was alright",
  rating: "3",
  movie: {
    id: "idM3",
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
  },
};

export const editReview = {
  id: "idR1",
  description: "Looked BAD XP",
  rating: "1",
  movie: {
    id: "idM1",
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
  },
};

export const editExtendedReview = {
  id: "idR1",
  description: "Looked BAD XP",
  rating: "1",
  movie: {
    id: "idM1",
    title: "title1",
    description: "description1",
    poster: "poster1",
    release_date: "2020-12-20",
    rating:"3",
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

export const editReview2 = {
  id: "idR1",
  description: "Looked better edit2",
  rating: "3",
  movie: {
    id: "idM1",
    title: "title1",
    description: "description1",
    poster: "poster1",
    release_date: "2020-12-20",
    rating:"4",
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

export const editExtendedReview2 = {
  id: "idR1",
  description: "Looked BAD XP",
  rating: "3",
  movie: {
    id: "idM1",
    title: "title1",
    description: "description1",
    poster: "poster1",
    release_date: "2020-12-20",
    rating:"1",
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

export const deleteReview2 = {
  id: "idR2",
  description: "Was alright",
  rating: "3",
  movie: {
    id: "idM3",
    title: "title3",
    description: "description3",
    poster: "poster3",
    release_date: "2000-09-25",
    category: {
      id: "idC1",
      name: "name1",
    },
    rating:"4",
  },

  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
};

export const deleteReview = {
  id: "idR7",
  description: "badbad",
  rating: "1",
  movie: {
    id: "idM2",
    title: "title2",
    description: "description2",
    poster: "poster2",
    release_date: "2015-06-30",
    category: {
      id: "idC1",
      name: "name1",
    },
    rating:"1",
  },
  user: {
    id: "idU1",
    first_name: "Test",
    last_name: "User1",
    email: "testuser1@gmail.com",
    role: "viewer",
  },
};

export const addReview = {
  rating: "3",
  description: "Awesome ADD",
  movie_id: "idM6",
  user_id: "idU4",
};

export const badAddReview = {
  rating: "2",
  description: "notgonnawork",
  movie_id: "idM3",
  user_id: "idU1",
};
