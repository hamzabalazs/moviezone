import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { adminCredentials, baseUrl, testMovie } from "../../support/e2e";
import {
  TITLE_REQUIRED_MESSAGE,
  NO_RATING_MESSAGE,
  NO_DESCRIPTION_MESSAGE,
  ALREADY_RATED_MESSAGE,
  DESCRIPTION_REQUIRED_MESSAGE,
  RELEASE_DATE_REQUIRED_MESSAGE,
  INVALID_DATE_FORMAT_MESSAGE,
} from "../../support/errormessages";

beforeEach(() => {
  cy.login(adminCredentials.email, adminCredentials.password);
  cy.wait(300);
});

before(() => {
  cy.getAdminToken().then((resp) => {
    const token = resp.body.data.logIn.token;
    cy.addMovie(testMovie, token);
  });
});

Given("I open home page", () => {
  cy.visit(baseUrl);
  cy.url().should("eq", baseUrl);
});

When("I click on test movie", () => {
  cy.get("#searchValue").type("test");
  cy.wait(300);
  cy.get('[data-testid="movie-list-card"]').first().click();
});

Then("I should be on movie page of test movie", () => {
  cy.url().should("include", baseUrl + "movie/");
});

Given("I open movie page", () => {
  cy.visit(baseUrl);
  cy.get("#searchValue").type("test");
  cy.wait(1000);
  cy.get('[data-testid="movie-list-card"]').first().click();
});

When("I arrive on movie page", () => {
  cy.url().should("include", baseUrl + "movie");
});

Then("List should be empty", () => {
  cy.get('[data-testid="review-card"]').should("not.exist");
});

When("I rate movie without rating", () => {
  cy.get('[data-testid="moviepage-review-description"]').type("testReview");
  cy.get('[data-testid="review-add"]').click();
});

Then("I should get rating required error", () => {
  cy.get("#notistack-snackbar").should("have.text", NO_RATING_MESSAGE);
});

When("I rate movie without description", () => {
  cy.get('[data-testid="moviepage-review-description"]').clear();
  cy.get('[data-testid="moviepage-review-rating"]')
    .find("label")
    .first()
    .click();
  cy.get('[data-testid="review-add"]').click();
});

Then("I should get description required error review add", () => {
  cy.get("#notistack-snackbar").should("have.text", NO_DESCRIPTION_MESSAGE);
});

When("I rate movie", () => {
  cy.get('[data-testid="moviepage-review-description"]')
    .clear()
    .type("testReview");
  cy.get('[data-testid="moviepage-review-rating"]')
    .find("label")
    .first()
    .click();
  cy.get('[data-testid="moviepage-review-rating"]')
    .find("label")
    .first()
    .click();
  cy.get('[data-testid="review-add"]').click();
});

Then("List should have one element", () => {
  cy.get('[data-testid="review-card"]').should("have.length", 1);
});

When("I rate movie again", () => {
  cy.get('[data-testid="moviepage-review-description"]')
    .clear()
    .type("testReview");
  cy.get('[data-testid="moviepage-review-rating"]')
    .find("label")
    .first()
    .click();
  cy.get('[data-testid="review-add"]').click();
});

Then("I should get movie already rated by user error", () => {
  cy.get("#notistack-snackbar").should("have.text", ALREADY_RATED_MESSAGE);
});

When("I click edit button on review", () => {
  cy.get('[data-testid="review-edit-button"]').first().click();
});

Then("I should see review edit modal", () => {
  cy.get('[data-testid="review-edit-modal"]').should("exist");
});

When("I submit without review description", () => {
  cy.get("#description").clear();
  cy.get('[data-testid="review-edit-modal-edit"]').click();
});

Then("I should get description required error review", () => {
  cy.get('[data-testid="review-edit-errors"]').should(
    "have.text",
    DESCRIPTION_REQUIRED_MESSAGE
  );
});

When("I submit with edited data review", () => {
  cy.get("#description").clear().type("editreviewdata");
  cy.get('[data-testid="review-edit-modal-edit"]').click();
});

Then("I should see edited review", () => {
  cy.get('[data-testid="review-card-description"]')
    .first()
    .should("have.text", "editreviewdata");
});

When("I click delete button on review", () => {
  cy.get('[data-testid="review-delete-button"]').first().click();
});

Then("I should see review delete dialog", () => {
  cy.get('[data-testid="review-delete-dialog"]').should("exist");
});

When("I click quit review", () => {
  cy.get('[data-testid="review-delete-dialog-quit"]').click();
});

Then("I should not see review delete dialog", () => {
  cy.get('[data-testid="review-delete-dialog"]').should("not.exist");
});

When("I click accept review", () => {
  cy.get('[data-testid="review-delete-dialog-accept"]').click();
});

When("I click on movie edit button", () => {
  cy.get('[data-testid="moviepage-edit-button"]').click();
});

Then("I should see movie edit modal", () => {
  cy.get('[data-testid="movie-edit-modal"]').should("exist");
});

When("I submit without title", () => {
  cy.get("#title").clear();
  cy.get('[data-testid="movie-edit-button"]').click();
});

Then("I should get title required error", () => {
  cy.get('[data-testid="movie-edit-errors"]').should(
    "have.text",
    TITLE_REQUIRED_MESSAGE
  );
});

When("I submit without description", () => {
  cy.get("#title").clear().type("test");
  cy.get("#description").clear();
  cy.get('[data-testid="movie-edit-button"]').click();
});

Then("I should get description required error", () => {
  cy.get('[data-testid="movie-edit-errors"]').should(
    "have.text",
    DESCRIPTION_REQUIRED_MESSAGE
  );
});

When("I submit without release date", () => {
  cy.get("#description").type("test");
  cy.get("#release_date").clear();
  cy.get('[data-testid="movie-edit-button"]').click();
});

Then("I should get release date required error", () => {
  cy.get('[data-testid="movie-edit-errors"]').should(
    "have.text",
    RELEASE_DATE_REQUIRED_MESSAGE
  );
});

When("I submit with invalid release date", () => {
  cy.get("#release_date").clear().type("invalid");
  cy.get('[data-testid="movie-edit-button"]').click();
});

Then("I should get invalid release date error", () => {
  cy.get('[data-testid="movie-edit-errors"]').should(
    "have.text",
    INVALID_DATE_FORMAT_MESSAGE
  );
});

When("I submit with edited data", () => {
  cy.get("#title").clear().type("testEDITED");
  cy.get("#description").clear().type("testEDITED");
  cy.get("#release_date").clear().type("2001-09-11");
  cy.get('[data-testid="movie-edit-button"]').click();
});

Then("I should see edited movie", () => {
  cy.get('[data-testid="movie-edit-modal"]').should("not.exist");
  cy.get('[data-testid="moviepage-description"]').should(
    "have.text",
    "Description: testEDITED"
  );
});

When("I click on movie delete button", () => {
  cy.get('[data-testid="moviepage-delete-button"]').click();
});

Then("I should see movie delete dialog", () => {
  cy.get('[data-testid="movie-delete-dialog"]').should("exist");
});

When("I click quit", () => {
  cy.get('[data-testid="movie-delete-quit"]').click();
});

Then("I should not see movie delete dialog", () => {
  cy.get('[data-testid="movie-delete-dialog"]').should("not.exist");
});

When("I click accept", () => {
  cy.get('[data-testid="movie-delete-accept"]').click();
});

Then("I should navigate to main page and movie should delete", () => {
  cy.wait(300);
  cy.url().should("eq", "http://localhost:3000/");
  cy.get("#searchValue").type("test");
  cy.wait(300);
  cy.get('[data-testid="movie-list-card"]').should("not.exist");
});
