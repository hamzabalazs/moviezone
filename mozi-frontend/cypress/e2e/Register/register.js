import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

after(() => {
    cy.getAdminToken().then((resp) => {
        const token = resp.body.data.logIn.token
        cy.deleteUser("email@gmail.com",token)
    })  
})

Given('I open register page',() => {
    cy.visit('http://localhost:3000/register')
})

When('I submit without any data',() => {
    cy.get('#submit').click()
})

Then('I should get error for every field',() => {
    cy.get('[data-testid="register-errors"]').should('have.length',4)
})

When('I submit without first name',() => {
    cy.get('#last_name').type("lastname")
    cy.get('#email').type("email@gmail.com")
    cy.get('#password').type("password")
    cy.get('#submit').click()
})

Then('I should get required first name error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"First name is required!")
})

When("I submit without last name",() => {
    cy.get('#first_name').type("firstname")
    cy.get('#email').type("email@gmail.com")
    cy.get('#password').type("password")
    cy.get('#submit').click()
})

Then('I should get required last name error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Last name is required!")
})

When("I submit without email",() => {
    cy.get('#first_name').type("firstname")
    cy.get('#last_name').type("lastname")
    cy.get('#password').type("password")
    cy.get('#submit').click()
})

Then('I should get required email error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Email is required!")
})

When("I submit without password",() => {
    cy.get('#first_name').type("firstname")
    cy.get('#last_name').type("lastname")
    cy.get('#email').type("email@gmail.com")
    cy.get('#submit').click()
})

Then('I should get required password error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Password is required!")
})

When("I submit with wrong email format",() => {
    cy.get('#first_name').type("firstname")
    cy.get('#last_name').type("lastname")
    cy.get('#email').type("bademailformat.com")
    cy.get('#password').type("password")
    cy.get('#submit').click()
})

Then('I should get invalid email error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Invalid email format!")
})

When("I submit with short password",() => {
    cy.get('#first_name').type("firstname")
    cy.get('#last_name').type("lastname")
    cy.get('#email').type("email@gmail.com")
    cy.get('#password').type("ps")
    cy.get('#submit').click()
})

Then('I should get invalid password error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Password has to be 5 or more characters long!")
})

When('I submit with existing data',() => {
    cy.get('#first_name').type("admin")
    cy.get('#last_name').type("admin")
    cy.get('#email').type("admin@example.com")
    cy.get('#password').type("admin")
    cy.get('#submit').click()
})

Then('I should get already exists error',() => {
    cy.get('#notistack-snackbar').should('have.text',"Account already exists!")
})

When("I submit with good data",() => {
    cy.get('#first_name').type("firstname")
    cy.get('#last_name').type("lastname")
    cy.get('#email').type("email@gmail.com")
    cy.get('#password').type("password")
    cy.get('#submit').click()
})

Then('I should see login page',() => {
    cy.url()
        .should('eq','http://localhost:3000/login')
})

When("I login with registered data",() => {
    cy.get("#email").type("email@gmail.com")
    cy.get("#password").type("password")
    cy.get("#submit").click()
})

Then("I should see main page",() => {
    cy.url()
        .should('eq','http://localhost:3000/')
})