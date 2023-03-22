import { gql } from "apollo-server";

export const GET_EXTENDED_REVIEWS = gql`
  query GetExtendedReviews {
    getExtendedReviews {
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
        reviews {
          id
          rating
          description
          user {
            id
            first_name
            last_name
          }
          movie {
            id
          }
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

export const GET_REVIEWS = gql`
  query GetReviews {
    getReviews {
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
export const ADD_REVIEW = gql`
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
        reviews {
          id
          rating
          description
          user {
            id
            first_name
            last_name
          }
          movie {
            id
          }
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
        reviews {
          id
          rating
          description
          user {
            id
            first_name
            last_name
          }
          movie {
            id
          }
        }
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
        category {
          id
          name
        }
        rating
        reviews {
          id
          rating
          description
          user {
            id
            first_name
            last_name
          }
          movie {
            id
          }
        }
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