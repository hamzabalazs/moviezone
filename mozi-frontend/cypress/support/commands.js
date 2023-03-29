Cypress.Commands.add("login", (email, password) => {
  cy.visit("http://localhost:3000/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#submit").click();
});

Cypress.Commands.add("getAdminToken",() => {
  cy.request({
    url: "http://localhost:5000/graphql",
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
          email:"admin@example.com",
          password:"admin"
        },
      },
    },
  })
})

Cypress.Commands.add("deleteUser", (email,token) => {
  cy.request({
    url: "http://localhost:5000/graphql",
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
      url: "http://localhost:5000/graphql",
    method: "POST",
    headers:{
      'auth-token' : token
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
          id:resp.body.data.checkForUser.id,
        },
      },
    },
    })
  })
});
