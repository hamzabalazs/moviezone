import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { aliasQuery } from "../../utils/graphql-test-utils";

Given("I open login page", () => {
  cy.visit("http://localhost:3000/login");
});

When('I click on register link',() => {
  cy.get('[href="/register"]').click()
})

Then('I should be on register page',() => {
  cy.url().should('eq','http://localhost:3000/register')
})

When('I click on forgot password link',() => {
  cy.get('[href="/forgotpass"]').click()
})

Then('I should be on forgot password page',() => {
  cy.url().should('eq','http://localhost:3000/forgotpass')
})

When("I submit login", () => {
  cy.get("#email").type("admin@example.com");
  cy.get("#password").type("admin");
  cy.get("#submit").click();
});

Then("I should see homepage", () => {
  cy.intercept("POST", "http://localhost:5000/graphql", (req) => {
    aliasQuery(req, "GetHomePageData");
  });
  cy.get("#searchValue").should("be.visible");
});

When("I submit login without password", () => {
  cy.get("#email").type("admin@example.com");
  cy.get("#submit").click();
});

Then("I should get password required error", () => {
  cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.text", "Password is required!")
    .and("have.length", 1);
});

When("I submit login without email", () => {
  cy.get("#password").type("admin");
  cy.get("#submit").click();
});

Then("I should get email required error", () => {
  cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.text", "Email is required!")
    .and("have.length", 1);
});

When("I submit login with bad credentials", () => {
  cy.get("#email").type("bademail@example.com");
  cy.get("#password").type("badpassword");
  cy.get("#submit").click();
});

Then("I should get user not found error", () => {
  cy.get("#notistack-snackbar").should(
    "have.text",
    "Invalid Email! Could not log in!"
  );
});

When("I submit login with invalid email", () => {
  cy.get("#email").type("formatwrong.com");
  cy.get("#password").type("password");
  cy.get("#submit").click();
});

Then("I should get invalid email error", () => {
  cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.text", "Invalid email format!")
    .and("have.length", 1);
});

When("I submit login with invalid password", () => {
  cy.get("#email").type("goodemail@gmail.com");
  cy.get("#password").type("ps");
  cy.get("#submit").click();
});

Then("I should get invalid password error", () => {
  cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.text", "Password has to be 5 or more characters long!")
    .and("have.length", 1);
});

When("I submit login without email and password", () => {
  cy.get("#submit").click();
});

Then("I should get two required errors",() => {
    cy.get('[data-testid="login-errors"')
    .should("be.visible")
    .and("have.length", 2);
})
