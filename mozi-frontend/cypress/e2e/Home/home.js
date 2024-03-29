import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { adminCredentials, baseUrl, testMovie } from "../../support/e2e";
import {MOVIE_ADDED_SUCCESSFUL} from '../../support/errormessages'

after(() => {
  cy.getAdminToken().then((resp) => {
    cy.deleteMovie(testMovie.title, resp.body.data.logIn.token);
  });
});

beforeEach(() => {
  cy.login(adminCredentials.email, adminCredentials.password);
});

Given("I open home page", () => {
  cy.url().should("eq", baseUrl);
  cy.get('[data-testid="movie-list-card"]').should("have.length", 9);
});

When("I sort by title", () => {
  cy.get("#sort-button").click();
  cy.get("#sort-title").click();
  cy.wait(100);
});

Then("Movie List should be sorted ascending", () => {
  cy.get('[data-testid="movie-list-card-title"]')
    .then(($titles) =>
      $titles.map(function () {
        return this.outerText;
      })
    )
    .then((list) => {
      return list.toArray();
    })
    .should("be.an", "array")
    .then((list) => {
      const sorted = Cypress._.sortBy(list);
      expect(sorted).to.deep.equal(list);
    });
});

Then("Movie List should be sorted descending", () => {
  cy.get('[data-testid="movie-list-card-title"]')
    .then(($titles) =>
      $titles.map(function () {
        return this.outerText;
      })
    )
    .then((list) => {
      return list.toArray();
    })
    .should("be.an", "array")
    .then((list) => {
      const sorted = Cypress._.sortBy(list.reverse());
      expect(sorted).to.deep.equal(list);
    });
});

When("Search field is empty", () => {
  cy.get("#searchValue").should("be.empty");
});

Then("Movie List should have 9 elements", () => {
  cy.get('[data-testid="movie-list-card"]').should("have.length", 9);
});

When("I search for a movie", () => {
  cy.get("#searchValue").type("All Quiet on The Western Front");
  cy.wait(500);
});

Then("Movie List should change to a single movie", () => {
  cy.get('[data-testid="movie-list-card"]').should("have.length", 1);
});

When("I scroll to bottom", () => {
  cy.get('[data-testid="footer"]').scrollIntoView();
  cy.wait(600);
});

Then("Movie List should load next elements", () => {
  cy.get('[data-testid="movie-list-card"]').should(
    "have.length.greaterThan",
    9
  );
});

Then("Movie List should not load new elements", () => {
  cy.get('[data-testid="movie-list-card"]').should("have.length.lessThan", 9);
});

When("I click on add button", () => {
  cy.get('[data-testid="movie-add-button"]').click();
});

Then("Add modal should be open", () => {
  cy.get('[data-testid="movie-add-card"]').should("be.visible");
});

When("I fill out all the details and submit", () => {
  cy.get("#title").type("test");
  cy.get("#description").type("test");
  cy.get("#release_date").type("1999-06-20");
  cy.get("[role='button']").first().click();
  cy.get("ul").find("li").first().click();
  cy.fixture("test.jpg", "binary").then((fileContent) => {
    cy.get('input[type="file"]').then((input) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileContent, "image/jpeg");
      const file = new File([blob], "test.jpg", { type: "image/jpeg" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input[0].files = dataTransfer.files;
      cy.wrap(input).trigger("change", { force: true });
    });
  });
  cy.get('[data-testid="movie-add"]').click();
  cy.get("#notistack-snackbar").should(
    "have.text",
    MOVIE_ADDED_SUCCESSFUL
  );
});

Then("Movie should be added", () => {
  cy.get("#searchValue").type("test");
  cy.get('[data-testid="movie-list-card"]').should("have.length", 1);
});

When("I choose a category", () => {
  cy.get('[data-testid="movie-list-card-title"]')
    .then(($titles) =>
      $titles.map(function () {
        return this.outerText;
      })
    )
    .then((list) => {
      return list.toArray();
    })
    .should("be.an", "array")
    .then((list) => {
      cy.wrap(list).as("beforeList");
    });
  cy.get('[data-testid="category-autocomplete"]').click();
  cy.get("ul").find("li").first().click();
  cy.wait(300);
});

Then("Movie list should change to other movies", () => {
  cy.get('[data-testid="movie-list-card-title"]')
    .then(($titles) =>
      $titles.map(function () {
        return this.outerText;
      })
    )
    .then((list) => {
      return list.toArray();
    })
    .should("be.an", "array")
    .then((list) => {
      cy.get("@beforeList").should("not.eq", list);
    });
});

When('I click on a movie',() => {
    cy.get('[data-testid="movie-list-card"]').first().click()
})

Then('Should navigate to MoviePage of movie',() => {
    cy.url().should('include', baseUrl + 'movie/')
})