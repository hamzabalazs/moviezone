import { adminCredentials } from "./e2e";
import { graphQlUrl } from "./e2e";
import { baseUrl } from "./e2e";

Cypress.Commands.add("login", (email, password) => {
  cy.visit(baseUrl);
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#submit").click();
});

Cypress.Commands.add("getAdminToken", () => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    body: {
      query: `
      mutation LogIn($input: LoginInput!) {
        logIn(input: $input) {
          token
        }
      }
      `,
      variables: {
        input: {
          email: adminCredentials.email,
          password: adminCredentials.password,
        },
      },
    },
  });
});

Cypress.Commands.add("deleteUser", (email, token) => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    body: {
      query: `
      query CheckForUser($input: UserEmailInput!) {
        checkForUser(input: $input) {
          id
          first_name
          last_name
          role
          email
        }
      }
      `,
      variables: {
        input: {
          email,
        },
      },
    },
  }).then((resp) => {
    cy.request({
      url: graphQlUrl,
      method: "POST",
      headers: {
        "auth-token": token,
      },
      body: {
        query: `
      mutation DeleteUser($input: DeleteUserInput!) {
        deleteUser(input: $input) {
          id
          first_name
          last_name
          role
          email
        }
      }
      `,
        variables: {
          input: {
            id: resp.body.data.checkForUser.id,
          },
        },
      },
    });
  });
});

Cypress.Commands.add("deleteMovie", (name, token) => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    body: {
      query: `
      query GetMovies($input: MoviePaginationInput!) {
        getMovies(input: $input) {
          id
        }
      }
      `,
      variables: {
        input: {
          limit: 1,
          offset: 0,
          category: [],
          searchField: name,
          orderByTitle: null,
          orderByCategory: null,
        },
      },
    },
  }).then((resp) => {
    cy.request({
      url: graphQlUrl,
      method: "POST",
      headers: {
        "auth-token": token,
      },
      body: {
        query: `
      mutation DeleteMovie($input: DeleteMovieInput!) {
        deleteMovie(input: $input) {
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
      `,
        variables: {
          input: {
            id: resp.body.data.getMovies[0].id,
          },
        },
      },
    });
  });
});

Cypress.Commands.add("addUser", (user) => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    body: {
      query: `
      mutation CreateUser($input: AddUserInput!) {
        createUser(input: $input) {
          id
          first_name
          last_name
          role
          email
        }
      }
      `,
      variables: {
        input: {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          password: user.password,
        },
      },
    },
  });
});

Cypress.Commands.add("getTotalUserCount", () => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    body: {
      query: `
      query GetNumberOfUsers {
        getNumberOfUsers {
          totalCount
        }
      }
      `,
    },
  }).then((response) => {
    return response.body.data.getNumberOfUsers.totalCount;
  });
});

Cypress.Commands.add("addReview", (review, token) => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    headers: {
      "auth-token": token,
    },
    body: {
      query: `
      mutation CreateReview($input: AddReviewInput!) {
        createReview(input: $input) {
          id
          rating
          description
          movie_id
          user_id
        }
      }
      `,
      variables: {
        input: {
          rating: review.rating,
          description: review.description,
          movie_id: review.movie_id,
          user_id: review.user_id,
        },
      },
    },
  });
});

Cypress.Commands.add("getTotalReviewsOfUserCount", (userId) => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    body: {
      query: `
      query GetNumberOfReviewsOfUser($input: numOfReviewsInput!) {
        getNumberOfReviewsOfUser(input: $input) {
          totalCount
        }
      }
      `,
      variables: {
        input: {
          user_id: userId,
          movie_id: "",
        },
      },
    },
  }).then((response) => {
    return response.body.data.getNumberOfReviewsOfUser.totalCount;
  });
});

Cypress.Commands.add("addCast", (cast, movie_id, token) => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    headers: {
      "auth-token": token,
    },
    body: {
      query: `
      mutation CreateCast($input: AddCastInput!) {
        createCast(input: $input) {
          id
          name
          photo
          description
          movie_id
        }
      }
      `,
      variables: {
        input: {
          id: cast.id,
          name: cast.name,
          photo: cast.photo,
          description: cast.description,
          movie_id:movie_id,
        },
      },
    },
  });
});

Cypress.Commands.add("addMovie", (movie, token) => {
  cy.request({
    url: graphQlUrl,
    method: "POST",
    headers: {
      "auth-token": token,
    },
    body: {
      query: `
        mutation CreateMovie($input: AddMovieInput!) {
          createMovie(input: $input) {
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
        `,
      variables: {
        input: {
          title: movie.title,
          description: movie.description,
          poster: movie.poster,
          release_date: movie.release_date,
          category_id: movie.category_id,
        },
      },
    },
  });
});
