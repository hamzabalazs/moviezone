import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I open forgot password page',() => {
    cy.visit('http://localhost:3000/forgotpass')
    cy.url().should('eq','http://localhost:3000/forgotpass')
})

When('I click login link',() => {
    cy.get('[href="/login"]').click()
})

Then('I should be on login page',() => {
    cy.url().should('eq','http://localhost:3000/login')
})

When('I submit without email',() => {
    cy.get('[data-testid="submit"]').click()
})

Then('I should get email required error',() => {
    cy.get('[data-testid="forgot-error-email"]').should('have.text',"Email is required!")
})

When('I submit with non existing email',() => {
    cy.get('#email').type("nonexisting@gmail.com")
    cy.get('[data-testid="submit"]').click()

})

Then('I should get email does not exist error',() => {
    cy.get('#notistack-snackbar').should('have.text',"The email cannot be found in our system!")
})

When('I submit with existing email',() => {
    cy.get('#email').type("admin@example.com")
    cy.get('[data-testid="submit"]').click()

})

Then('I should get success message and navigate to login',() => {
    cy.url().should('eq',"http://localhost:3000/login")
    cy.get('#notistack-snackbar').should('have.text','We have sent you an email with the instructions to reset your password!')
})

