import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetFullUsers($input: UserPaginationInput) {
    getUsers(input: $input) {
      id
      first_name
      last_name
      email
      password
      role
    }
    getNumberOfUsers {
      totalCount
    }
  }
`;

export const CHECK_FOR_USER = gql`
  query CheckForUser($input: UserEmailInput!) {
    checkForUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: AddUserInput!) {
    createUser(input: $input) {
      id
      first_name
      last_name
      role
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      first_name
      last_name
      role
      email
      password
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
      first_name
      last_name
      role
      email
      password
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: changePasswordInput!) {
    changePassword(input: $input) {
      lastID
      changes
    }
  }
`;

export const SEND_FORGOT_PASS = gql`
  mutation SendForgotPassEmail($input: resetTokenInput!) {
    sendForgotPassEmail(input: $input)
  }
`;

export const GET_USER_FOR_PASS_CHANGE = gql`
  query GetUserForPassChange($input: getUserForPassChangeInput!) {
    getUserForPassChange(input: $input) {
      id
      first_name
      last_name
      role
      email
      password
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($input:numOfReviewsForChart!) {
    getAllMovies {
      id
      title
    },
    getNumberOfReviewsOfMoviePerMonth(input: $input) {
      totalCount
    },
    getAverageOfReviewsOfMoviePerMonth(input: $input) {
      average
    },
    getNumberOfMoviesPerCategory {
      name
      totalCount
    },
    getNumberOfMoviesPerYear {
      totalCount
      year
    },
  }
`;

// export const GET_ALL_MOVIES = gql`
//   query GetAllMovies {
//     getAllMovies {
//       id
//       title
//     }
//   }
// `;

// export const GET_REVIEW_DATA_NR = gql`
//   query GetNumberOfReviewsOfMoviePerMonth($input: numOfReviewsForChart!) {
//     getNumberOfReviewsOfMoviePerMonth(input: $input) {
//       totalCount
//     }
//   }
// `;

// export const GET_REVIEW_DATA_AVG = gql`
//   query GetNumberOfReviewsOfMoviePerMonth($input: numOfReviewsForChart!) {
//     getAverageOfReviewsOfMoviePerMonth(input: $input) {
//       average
//     }
//   }
// `;

// export const GET_MOVIE_DATA_NR_CATEGORY = gql`
//   query GetNumberOfMoviesPerCategory {
//     getNumberOfMoviesPerCategory {
//       name
//       totalCount
//     }
//   }
// `;

// export const GET_MOVIE_DATA_NR_YEAR = gql`
//   query GetNumberOfMoviesPerYear {
//     getNumberOfMoviesPerYear {
//       totalCount
//       year
//     }
//   }
// `;
