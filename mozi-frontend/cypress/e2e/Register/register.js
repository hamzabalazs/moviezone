import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

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
    cy.visit('http://localhost:3000/register')
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
    cy.get('[data-testid="register-errors"]').should('have.text',"First name is required!")
})

When("I submit without last name",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear()
    cy.get('#email').clear().type(testRegister.email)
    cy.get('#password').clear().type(testRegister.password)
    cy.get('#submit').click()
})

Then('I should get required last name error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Last name is required!")
})

When("I submit without email",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear()
    cy.get('#password').clear().type(testRegister.password)
    cy.get('#submit').click()
})

Then('I should get required email error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Email is required!")
})

When("I submit without password",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear().type(testRegister.email)
    cy.get('#password').clear()
    cy.get('#submit').click()
})

Then('I should get required password error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Password is required!")
})

When("I submit with wrong email format",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear().type("wrongformat.com")
    cy.get('#password').clear().type(testRegister.password)
    cy.get('#submit').click()
})

Then('I should get invalid email error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Invalid email format!")
})

When("I submit with short password",() => {
    cy.get('#first_name').clear().type(testRegister.firstName)
    cy.get('#last_name').clear().type(testRegister.lastName)
    cy.get('#email').clear().type(testRegister.email)
    cy.get('#password').clear().type("ps")
    cy.get('#submit').click()
})

Then('I should get invalid password error',() => {
    cy.get('[data-testid="register-errors"]').should('have.text',"Password has to be 5 or more characters long!")
})

When('I submit with existing data',() => {
    cy.get('#first_name').clear().type("admin")
    cy.get('#last_name').clear().type("admin")
    cy.get('#email').clear().type("admin@example.com")
    cy.get('#password').clear().type("admin")
    cy.get('#submit').click()
})

Then('I should get already exists error',() => {
    cy.get('#notistack-snackbar').should('have.text',"Account already exists!")
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
        .should('eq','http://localhost:3000/login')
})

When("I login with registered data",() => {
    cy.get("#email").type(testRegister.email)
    cy.get("#password").type(testRegister.password)
    cy.get("#submit").click()
})

Then("I should see main page",() => {
    cy.url()
        .should('eq','http://localhost:3000/')
})