import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { aliasQuery } from "../../utils/graphql-test-utils";
import { baseUrl, graphQlUrl } from "../../support/e2e";
import { EMAIL_REQUIRED_MESSAGE, INVALID_EMAIL_FORMAT_MESSAGE, INVALID_PASSWORD_FORMAT_MESSAGE, LOGIN_ERROR_MESSAGE, PASSWORD_REQUIRED_MESSAGE } from "../../support/errormessages";

Given("I open login page", () => {
  cy.visit(baseUrl + "login");
});

When('I click on register link',() => {
  cy.get('[href="/register"]').click()
})

Then('I should be on register page',() => {
  cy.url().should('eq',baseUrl + 'register')
})

When('I click on forgot password link',() => {
  cy.get('[href="/forgotpass"]').click()
})

Then('I should be on forgot password page',() => {
  cy.url().should('eq',baseUrl + 'forgotpass')
})

When("I submit login", () => {
  cy.get("#email").clear().type("admin@example.com");
  cy.get("#password").clear().type("admin");
  cy.get("#submit").click();
});

Then("I should see homepage", () => {
  cy.intercept("POST", graphQlUrl, (req) => {
    aliasQuery(req, "GetHomePageData");
  });
  cy.get("#searchValue").should("be.visible");
});

When("I submit login without password", () => {
  cy.get("#email").clear().type("admin@example.com");
  cy.get('#password').clear()
  cy.get("#submit").click();
});

Then("I should get password required error", () => {
  cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.text", PASSWORD_REQUIRED_MESSAGE)
    .and("have.length", 1);
});

When("I submit login without email", () => {
  cy.get('#email').clear()
  cy.get("#password").clear().type("admin");
  cy.get("#submit").click();
});

Then("I should get email required error", () => {
  cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.text", EMAIL_REQUIRED_MESSAGE)
    .and("have.length", 1);
});

When("I submit login with bad credentials", () => {
  cy.get("#email").clear().type("bademail@example.com");
  cy.get("#password").clear().type("badpassword");
  cy.get("#submit").click();
});

Then("I should get user not found error", () => {
  cy.get("#notistack-snackbar").should(
    "have.text",
    LOGIN_ERROR_MESSAGE
  );
});

When("I submit login with invalid email", () => {
  cy.get("#email").clear().type("formatwrong.com");
  cy.get("#password").clear().type("password");
  cy.get("#submit").click();
});

Then("I should get invalid email error", () => {
  cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.text", INVALID_EMAIL_FORMAT_MESSAGE)
    .and("have.length", 1);
});

When("I submit login with invalid password", () => {
  cy.get("#email").clear().type("goodemail@gmail.com");
  cy.get("#password").clear().type("ps");
  cy.get("#submit").click();
});

Then("I should get invalid password error", () => {
  cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.text", INVALID_PASSWORD_FORMAT_MESSAGE)
    .and("have.length", 1);
});

When("I submit login without email and password", () => {
  cy.get("#email").clear()
  cy.get("#password").clear()
  cy.get("#submit").click();
});

Then("I should get two required errors",() => {
    cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.length", 2);
})
