import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { adminCredentials, baseUrl } from "../../support/e2e";
import { DESCRIPTION_REQUIRED_MESSAGE } from "../../support/errormessages";

const userId = "e7a34320-ff37-455c-98c8-b36f2d80d427";

const testReview = {
  rating: "5",
  description: "test",
  movie_id: "91bc8f13-bec6-4182-a99b-8bd1a7e7924c",
  user_id: "e7a34320-ff37-455c-98c8-b36f2d80d427",
};

const testReviewEdited = {
  rating: "5",
  description: "testEDITED",
  movie_id: "91bc8f13-bec6-4182-a99b-8bd1a7e7924c",
  user_id: "e7a34320-ff37-455c-98c8-b36f2d80d427",
};


before(() => {
  cy.getAdminToken().then((resp) => {
    cy.addReview(testReview,resp.body.data.logIn.token)
  })
});

beforeEach(() => {
  cy.login(adminCredentials.email, adminCredentials.password);
  cy.wait(300);
});

Given("I open reviews page", () => {
  cy.visit(baseUrl + "reviews");
});

When("I arrive on page", () => {
  cy.url().should("eq", baseUrl + "reviews");
});

Then("I should see at most three reviews", () => {
  cy.get('[data-testid="review-card"]').should("have.length.at.most", 3);
});

When("I scroll to bottom", () => {
  cy.get('[data-testid="footer"]').scrollIntoView();
  cy.wait(500);
});

Then("I should see at most six reviews", () => {
  cy.get('[data-testid="review-card"]').should("have.length.at.most", 6);
});

Given("I open reviews page and scroll to last review", () => {
  cy.visit(baseUrl + "reviews");
  cy.getTotalReviewsOfUserCount(userId).then((totalCount) => {
    const numScrolls = Math.ceil(totalCount / 3);

    for (let i = 0; i < numScrolls; i++) {
      cy.get('[data-testid="review-card"]')
        .last()
        .scrollIntoView()
        .then(() => {
          cy.get('[data-testid="review-card"]').last().trigger("scroll");
        });
      cy.wait(500);
    }
  });

  cy.get('[data-testid="review-card-description"]')
    .contains('test')
    .should("exist");
});

When("I click on review edit button", () => {
  cy.get('[data-testid="review-card"]')
    .find('[data-testid="review-card-description"]')
    .contains('test')
    .should('exist')
    .parents('[data-testid="review-card"]')
    .find('[data-testid="review-edit-button"]')
    .should('exist')
    .click()
});

Then("I should see review edit modal", () => {
  cy.get('[data-testid="review-edit-modal"]').should("exist");
});

When("I submit without description", () => {
  cy.get('[data-testid="review-edit-modal-description"]').clear();
  cy.get('[data-testid="review-edit-modal-edit"]').click();
});

Then("I should get description required error", () => {
  cy.get('[data-testid="review-edit-errors"]').should(
    "have.text",
    DESCRIPTION_REQUIRED_MESSAGE
  );
});

When("I submit with correct data", () => {
  cy.get('[data-testid="review-edit-modal-description"]')
    .clear()
    .type(testReviewEdited.description);
  cy.get('[data-testid="review-edit-modal-rating"').find('label').first().click()
  cy.get('[data-testid="review-edit-modal-edit"]').click();
});

Then("I should see edited review", () => {
  cy.get('[data-testid="review-card"]')
    .find('[data-testid="review-card-description"]')
    .contains(testReviewEdited.description)
    .should('exist')
    .parents('[data-testid="review-card"]')
    .find('[data-testid="review-edit-button"]')
    .should('exist')
    .click()
});

Given("I open reviews page and scroll to last review after edit", () => {
  cy.visit(baseUrl + "reviews");
  cy.getTotalReviewsOfUserCount(userId).then((totalCount) => {
    const numScrolls = Math.ceil(totalCount / 3);

    for (let i = 0; i < numScrolls; i++) {
      cy.get('[data-testid="review-card"]')
        .last()
        .scrollIntoView()
        .then(() => {
          cy.get('[data-testid="review-card"]').last().trigger("scroll");
        });
      cy.wait(500);
    }
  });

  cy.get('[data-testid="review-card-description"]')
    .contains(testReviewEdited.description)
    .should("exist");
});

When('I click on review delete button',() => {
  cy.get('[data-testid="review-card"]')
  .find('[data-testid="review-card-description"]')
  .contains(testReviewEdited.description)
  .should('exist')
  .parents('[data-testid="review-card"]')
  .find('[data-testid="review-delete-button"]')
  .should('exist')
  .click()
})

Then('I should see review delete dialog',() => {
    cy.get('[data-testid="review-delete-dialog"]').should('exist')
})

When('I click quit',() => {
    cy.get('[data-testid="review-delete-dialog-quit"]').click()
})

Then('I should not see review delete dialog',() => {
    cy.get('[data-testid="review-delete-dialog"]').should('not.exist')

})

When('I click accept',() => {
    cy.getTotalReviewsOfUserCount(userId).then((resp) => {
        cy.wrap(resp).as("totalCount")
    })
    cy.get('[data-testid="review-delete-dialog-accept"]').click()
    cy.wait(300)
})

Then('Review should be deleted',() => {
    cy.getTotalReviewsOfUserCount(userId).then((resp) => {
        cy.get('@totalCount').should('eq',resp + 1)
    })
})
