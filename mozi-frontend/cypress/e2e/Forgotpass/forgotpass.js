import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { baseUrl } from '../../support/e2e'
import { EMAIL_REQUIRED_MESSAGE,EMAIL_NOT_FOUND_MESSAGE,RESET_PASS_SENT_MESSAGE } from '../../support/errormessages'

Given('I open forgot password page',() => {
    cy.visit(baseUrl+'forgotpass')
    cy.url().should('eq',baseUrl + 'forgotpass')
})

When('I click login link',() => {
    cy.get('[href="/login"]').click()
})

Then('I should be on login page',() => {
    cy.url().should('eq',baseUrl + 'login')
})

When('I submit without email',() => {
    cy.get('[data-testid="submit"]').click()
})

Then('I should get email required error',() => {
    cy.get('[data-testid="forgot-error-email"]').should('have.text',EMAIL_REQUIRED_MESSAGE)
})

When('I submit with non existing email',() => {
    cy.get('#email').type("nonexisting@gmail.com")
    cy.get('[data-testid="submit"]').click()

})

Then('I should get email does not exist error',() => {
    cy.get('#notistack-snackbar').should('have.text',EMAIL_NOT_FOUND_MESSAGE)
})

When('I submit with existing email',() => {
    cy.get('#email').type("admin@example.com")
    cy.get('[data-testid="submit"]').click()

})

Then('I should get success message and navigate to login',() => {
    cy.url().should('eq',baseUrl + "login")
    cy.get('#notistack-snackbar').should('have.text',RESET_PASS_SENT_MESSAGE)
})

