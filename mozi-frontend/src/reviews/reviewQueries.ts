import { gql } from "@apollo/client";

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
