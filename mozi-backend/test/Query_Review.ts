import { gql } from "apollo-server";

export const GET_REVIEWS = gql`
  query GetReviews {
    getReviews {
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
        id
        first_name
        last_name
        role
        email
      }
    }
  }
`;
export const GET_REVIEW_BY_ID = gql`
  query GetReviewById($input: ReviewInput!) {
    getReviewById(input: $input) {
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
        id
        first_name
        last_name
        role
        email
      }
    }
  }
`;
export const GET_REVIEWS_OF_USER_FOR_MOVIE = gql`
  query GetReviewsOfUserForMovie($input: GetReviewsOfUserForMovieInput!) {
    getReviewsOfUserForMovie(input: $input) {
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
        id
        first_name
        last_name
        role
        email
      }
    }
  }
`;
export const GET_REVIEWS_OF_MOVIE = gql`
  query GetReviewsOfMovie($input: GetReviewsOfMovieInput!) {
    getReviewsOfMovie(input: $input) {
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
        id
        first_name
        last_name
        role
        email
      }
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
        category {
          id
          name
        }
        rating
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
