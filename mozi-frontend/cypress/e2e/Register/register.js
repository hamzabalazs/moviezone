import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { baseUrl } from '../../support/e2e'
import { ACCOUNT_EXISTS_MESSAGE, EMAIL_REQUIRED_MESSAGE, FIRST_NAME_REQUIRED_MESSAGE, INVALID_EMAIL_FORMAT_MESSAGE, INVALID_PASSWORD_FORMAT_MESSAGE, LAST_NAME_REQUIRED_MESSAGE, PASSWORD_REQUIRED_MESSAGE } from '../../support/errormessages'

const testRegister = {
    firstName:"firstname",
    lastName:"lastname",
    email:"email@gmail.com",
    password:"password"
}

after(() => {
    cy.getAdminToken().then((resp) => {
        const token = resp.body.data.logIn.token
        cy.deleteUser(testRegister.email,token)
    })  
})



Given('I open register page',() => {
    cy.visit(baseUrl + 'register')
})

When('I submit without any data',() => {
    cy.get('#submit').click()
})

Then('I should get error for every field',() => {
    cy.get('[data-testid="register-errors"]').should('have.length',4)
})

When('I submit without first name',() => {
    cy.get('#first_name').clear()
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear().type(testRegister.email)
    cy.get('#password').clear().type(testRegister.password)
    cy.get('#submit').click()
})

Then('I should get required first name error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',FIRST_NAME_REQUIRED_MESSAGE)
})

When("I submit without last name",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear()
    cy.get('#email').clear().type(testRegister.email)
    cy.get('#password').clear().type(testRegister.password)
    cy.get('#submit').click()
})

Then('I should get required last name error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',LAST_NAME_REQUIRED_MESSAGE)
})

When("I submit without email",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear()
    cy.get('#password').clear().type(testRegister.password)
    cy.get('#submit').click()
})

Then('I should get required email error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',EMAIL_REQUIRED_MESSAGE)
})

When("I submit without password",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear().type(testRegister.email)
    cy.get('#password').clear()
    cy.get('#submit').click()
})

Then('I should get required password error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',PASSWORD_REQUIRED_MESSAGE)
})

When("I submit with wrong email format",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear().type("wrongformat.com")
    cy.get('#password').clear().type(testRegister.password)
    cy.get('#submit').click()
})

Then('I should get invalid email error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',INVALID_EMAIL_FORMAT_MESSAGE)
})

When("I submit with short password",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear().type(testRegister.email)
    cy.get('#password').clear().type("ps")
    cy.get('#submit').click()
})

Then('I should get invalid password error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',INVALID_PASSWORD_FORMAT_MESSAGE)
})

When('I submit with existing data',() => {
    cy.get('#first_name').clear().type("admin")
    cy.get('#last_name').clear().type("admin")
    cy.get('#email').clear().type("admin@example.com")
    cy.get('#password').clear().type("admin")
    cy.get('#submit').click()
})

Then('I should get already exists error',() => {
    cy.get('#notistack-snackbar').should('have.text',ACCOUNT_EXISTS_MESSAGE)
})

When("I submit with good data",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear().type(testRegister.email)
    cy.get('#password').clear().type(testRegister.password)
    cy.get('#submit').click()
})

Then('I should see login page',() => {
    cy.url()
        .should('eq',baseUrl + 'login')
})

When("I login with registered data",() => {
    cy.get("#email").type(testRegister.email)
    cy.get("#password").type(testRegister.password)
    cy.get("#submit").click()
})

Then("I should see main page",() => {
    cy.url()
        .should('eq',baseUrl)
})