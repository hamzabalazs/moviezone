import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const testUser = {
    firstName:"test",
    lastName:"test",
    email:"test@gmail.com",
    password:"testtest",
}

const editedTestUser = {
    firstName:"testEDITED",
    lastName:"testEDITED",
    email:"testEDITED@gmail.com",
    password:"testEDITED",
}

before(() => {
    cy.addUser(testUser)
})

Given('I login as test user',() => {
    cy.login(testUser.email,testUser.password)
    cy.wait(300)
})

When('I click on accounts page',() => {
    cy.get('[data-testid="navbar-account-bubble"]').click()
    cy.get('[data-testid="navbar-account-menuitem"]').click()
    cy.wait(300)
})

Then('I should be on accounts page',() => {
    cy.url().should('eq','http://localhost:3000/account')
    cy.wait(300)
})

When('I click on user edit',() => {
    cy.get('[data-testid="user-card-edit-button"]').click()
})

Then('I should see user edit modal',() => {
    cy.get('[data-testid="user-edit-modal"]').should('exist')
})
When('I submit without first name',() => {
    cy.get('#password').clear().type('placeholder')
    cy.get('#first_name').clear()
    cy.get('[data-testid="user-edit-modal-submit"]').click()
})

Then('I should get first name required error',() => {
    cy.get('[data-testid="user-edit-errors"]').should('have.text',"First name is required!")
})
When('I submit without last name',() => {
    cy.get('#first_name').clear().type('placeholder')
    cy.get('#last_name').clear()
    cy.get('[data-testid="user-edit-modal-submit"]').click()
})

Then('I should get last name required error',() => {
    cy.get('[data-testid="user-edit-errors"]').should('have.text',"Last name is required!")

})
When('I submit without email',() => {
    cy.get('#last_name').clear().type('placeholder')
    cy.get('#email').clear()
    cy.get('[data-testid="user-edit-modal-submit"]').click()
})

Then('I should get email required error',() => {
    cy.get('[data-testid="user-edit-errors"]').should('have.text',"Email is required!")

})

When('I submit with invalid email',() => {
    cy.get('#email').clear().type('placeholder.com')
    cy.get('[data-testid="user-edit-modal-submit"]').click()
})

Then('I should get invalid email error',() => {
    cy.get('[data-testid="user-edit-errors"]').should('have.text',"Invalid email format!")

})

When('I submit without password',() => {
    cy.get('#email').clear().type('placeholder@gmail.com')
    cy.get('#password').clear()
    cy.get('[data-testid="user-edit-modal-submit"]').click()
})

Then('I should get password required error',() => {
    cy.get('[data-testid="user-edit-errors"]').should('have.text',"Password is required!")

})

When('I submit with invalid password',() => {
    cy.get('#password').clear().type('ps')
    cy.get('[data-testid="user-edit-modal-submit"]').click()
})

Then('I should get invalid password error',() => {
    cy.get('[data-testid="user-edit-errors"]').should('have.text',"Password has to be 5 or more characters long!")

})

When('I submit with edited data',() => {
    cy.get('#first_name').clear().type(editedTestUser.firstName)
    cy.get('#last_name').clear().type(editedTestUser.lastName),
    cy.get('#email').clear().type(editedTestUser.email),
    cy.get('#password').clear().type(editedTestUser.password)
    cy.get('[data-testid="user-edit-modal-submit"]').click()
})

Then('I should see my edited data after edit',() => {
    cy.get('#notistack-snackbar').should('have.text',"User was edited successfully!")
    cy.get('[data-testid="user-card-email"]').should('have.text',editedTestUser.email)
})

Given('I login as test user with edited values',() => {
    cy.login(editedTestUser.email,editedTestUser.password)
    cy.wait(300)
})

Then('I should see my edited data',() => {
    cy.get('[data-testid="user-card-email"]').should('have.text',editedTestUser.email)
})

When('I click on user delete',() => {
    cy.get('[data-testid="user-card-delete-button"]').click()
})

Then('I should see user delete dialog',() => {
    cy.get('[data-testid="user-delete-dialog"]').should('exist')
})

When('I click quit deletion',() => {
    cy.get('[data-testid="user-delete-dialog-quit"]').click()
})

Then('I should not see user delete dialog',() => {
    cy.get('[data-testid="user-delete-dialog"]').should('not.exist')

})

When('I click accept deletion',() => {
    cy.get('[data-testid="user-delete-dialog-accept"]').click()
    cy.wait(300)
})

Then('I should navigate to login page',() => {
    cy.url().should('eq','http://localhost:3000/login')
})


Then('I should get not exist error',() => {
    cy.get('#notistack-snackbar').should('have.text',"Invalid Email! Could not log in!")
})