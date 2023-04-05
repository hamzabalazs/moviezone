import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { adminCredentials, baseUrl } from "../../support/e2e";
import { EMAIL_REQUIRED_MESSAGE, FIRST_NAME_REQUIRED_MESSAGE, INVALID_EMAIL_FORMAT_MESSAGE, INVALID_PASSWORD_FORMAT_MESSAGE, LAST_NAME_REQUIRED_MESSAGE, PASSWORD_REQUIRED_MESSAGE } from "../../support/errormessages";

const testUser = {
  firstName: "test",
  lastName: "test",
  email: "test@gmail.com",
  password: "testtest",
};

const editedTestUser = {
  firstName: "testEDITED",
  lastName: "testEDITED",
  email: "testEDITED@gmail.com",
  password: "testtest",
};

before(() => {
  cy.addUser(testUser);
});

beforeEach(() => {
  cy.login(adminCredentials.email, adminCredentials.password);
  cy.wait(300);
});

Given("I open users page", () => {
  cy.visit(baseUrl + "users");
});

When("I arrive on users page", () => {
  cy.url().should("eq", baseUrl + "users");
  cy.wait(300);
});

Then("I see a list of users", () => {
  cy.get('[data-testid="user-card"]')
    .should("exist")
    .should("have.length.at.least", 1);
});

Given("I open users page and go to last user listed", () => {
  cy.visit(baseUrl + "users");
  cy.getTotalUserCount().then((totalCount) => {
    const numScrolls = Math.ceil(totalCount / 3);

    for (let i = 0; i < numScrolls; i++) {
      cy.get('[data-testid="user-card"]').last().scrollIntoView();
      cy.wait(500);
    }
  });
  cy.get('[data-testid="user-card-email"')
    .last()
    .should("have.text", testUser.email);
});

When("I click on edit button of user", () => {
  cy.get('[data-testid="user-card-edit-button"]').last().click();
});

Then("Edit modal should open", () => {
  cy.get('[data-testid="user-edit-modal"]').should("exist");
});

When('I clear first_name and submit',() => {
  cy.get("#first_name").clear()
  cy.get('#last_name').clear().type(editedTestUser.lastName)
  cy.get('#email').clear().type(editedTestUser.email)
  cy.get("#password").clear().type(editedTestUser.password);
  cy.get('[data-testid="user-edit-modal-submit"]').click();
})

Then('I should get first_name required error',() => {
  cy.get('[data-testid="user-edit-errors"]').should('have.length',1).should('have.text',FIRST_NAME_REQUIRED_MESSAGE)
})

When('I clear last_name and submit',() => {
  cy.get("#first_name").clear().type(editedTestUser.firstName)
  cy.get('#last_name').clear()
  cy.get('#email').clear().type(editedTestUser.email)
  cy.get("#password").clear().type(editedTestUser.password);
  cy.get('[data-testid="user-edit-modal-submit"]').click();
})

Then('I should get last_name required error',() => {
  cy.get('[data-testid="user-edit-errors"]').should('have.length',1).should('have.text',LAST_NAME_REQUIRED_MESSAGE)
})

When('I clear email and submit',() => {
  cy.get("#first_name").clear().type(editedTestUser.firstName)
  cy.get('#last_name').clear().type(editedTestUser.lastName)
  cy.get('#email').clear()
  cy.get("#password").clear().type(editedTestUser.password);
  cy.get('[data-testid="user-edit-modal-submit"]').click();
})

Then('I should get email required error',() => {
  cy.get('[data-testid="user-edit-errors"]').should('have.length',1).should('have.text',EMAIL_REQUIRED_MESSAGE)
})

When('I type invalid email and submit',() => {
  cy.get("#first_name").clear().type(editedTestUser.firstName)
  cy.get('#last_name').clear().type(editedTestUser.lastName)
  cy.get('#email').clear().type("invalid.com")
  cy.get("#password").clear().type(editedTestUser.password);
  cy.get('[data-testid="user-edit-modal-submit"]').click();
})

Then('I should get invalid email error',() => {
  cy.get('[data-testid="user-edit-errors"]').should('have.length',1).should('have.text',INVALID_EMAIL_FORMAT_MESSAGE)
})

When('I clear password and submit',() => {
  cy.get("#first_name").clear().type(editedTestUser.firstName)
  cy.get('#last_name').clear().type(editedTestUser.lastName)
  cy.get('#email').clear().type(editedTestUser.email)
  cy.get("#password").clear()
  cy.get('[data-testid="user-edit-modal-submit"]').click();
})

Then('I should get password required error',() => {
  cy.get('[data-testid="user-edit-errors"]').should('have.length',1).should('have.text',PASSWORD_REQUIRED_MESSAGE)
})

When('I type short password and submit',() => {
  cy.get("#first_name").clear().type(editedTestUser.firstName)
  cy.get('#last_name').clear().type(editedTestUser.lastName)
  cy.get('#email').clear().type(editedTestUser.email)
  cy.get("#password").clear().type('ps');
  cy.get('[data-testid="user-edit-modal-submit"]').click();
})

Then('I should get invalid password error',() => {
  cy.get('[data-testid="user-edit-errors"]').should('have.length',1).should('have.text',INVALID_PASSWORD_FORMAT_MESSAGE)
})

When("I clear all data and submit", () => {
  cy.get("#first_name").clear()
  cy.get('#last_name').clear()
  cy.get('#email').clear()
  cy.get("#password").clear()
  cy.get('[data-testid="user-edit-modal-submit"]').click();
});

Then('I should get 4x required error',() => {
  cy.get('[data-testid="user-edit-errors"]').should('have.length',4)

})

When("I change data and submit", () => {
  cy.get("#first_name").clear().type(editedTestUser.firstName)
  cy.get('#last_name').clear().type(editedTestUser.lastName)
  cy.get('#email').clear().type(editedTestUser.email)
  cy.get("#password").clear().type(editedTestUser.password);
  cy.get('[data-testid="user-edit-modal-submit"]').click();
});

Then("User should be edited", () => {
  cy.get('[data-testid="user-card-email"')
    .last()
    .should("have.text", editedTestUser.email);
});

Given("I open users page and go to last user listed after edit", () => {
    cy.visit(baseUrl + "users");
    cy.getTotalUserCount().then((totalCount) => {
      const numScrolls = Math.ceil(totalCount / 3);
  
      for (let i = 0; i < numScrolls; i++) {
        cy.get('[data-testid="user-card"]').last().scrollIntoView().then(() => {
            cy.get('[data-testid="user-card"]').last().trigger('scroll');
          });
        cy.wait(500);
      }
    });
    cy.get('[data-testid="user-card-email"')
      .last()
      .should("have.text", editedTestUser.email);
  });

When("I click on delete button of user", () => {
  cy.get('[data-testid="user-card-delete-button"]').last().click();
});

Then("Delete dialog should open", () => {
    cy.get('[data-testid="user-delete-dialog"]').should('exist')
});

When("I click on quit", () => {
    cy.get('[data-testid="user-delete-dialog-quit"]').click()
});

Then("Delete dialog should not be open", () => {
    cy.get('[data-testid="user-delete-dialog"]').should('not.exist')
});

When("I click on accept", () => {
    cy.getTotalUserCount().then((resp) => {
        cy.wrap(resp).as("totalCount")
    })
    cy.get('[data-testid="user-delete-dialog-accept"]').click()
    cy.wait(300)

});

Then("User should be deleted", () => {
    cy.getTotalUserCount().then((resp) => {
        cy.get('@totalCount').should('eq',resp+1)
    })
});
