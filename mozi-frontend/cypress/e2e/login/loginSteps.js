import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { aliasQuery, aliasMutation } from "../../utils/graphql-test-utils";

Given("I open login page", () => {
  cy.visit("http://localhost:3000/login");
});

When("I submit login", () => {
  cy.get("#email").type("admin@example.com");
  cy.get("#password").type("admin");
  cy.get("#submit").click();
});

Then("I should see homepage", () => {
  cy.intercept("POST", "http://localhost:5000/graphql", (req) => {
    aliasQuery(req, "GetHomePageData");
  });
  cy.wait("@gqlGetHomePageDataQuery")
    .its("response.body.data.getMovies")
    .should("have.length", 9);
  cy.get("#searchValue").should("be.visible");
});
