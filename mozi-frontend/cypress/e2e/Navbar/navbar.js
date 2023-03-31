import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const adminCredentials = {
    email:"admin@example.com",
    password:"admin"
}

const editorCredentials = {
    email:"editor@example.com",
    password:"editor"
}

const viewerCredentials = {
    email:"viewer@example.com",
    password:"viewer"
}

Given('I login as admin',() => {
    cy.login(adminCredentials.email,adminCredentials.password)
    cy.url()
        .should('eq','http://localhost:3000/') 
})

When("I navigate to category page",() => {
    cy.get('[href="/categories"]').click()
})

Then("I should be on category page",() => {
    cy.url()
        .should('eq','http://localhost:3000/categories')
})

When("I navigate to users page",() => {
    cy.get('[href="/users"]').click()
})

Then("I should be on users page",() => {
    cy.url()
        .should('eq','http://localhost:3000/users')
})

When("I navigate to account page",() => {
    cy.get('[data-testid="navbar-account-bubble"]').click()
    cy.get('[data-testid="navbar-account-menuitem"]').click()
})

Then("I should be on account page",() => {
    cy.url()
        .should('eq','http://localhost:3000/account')
})

Given('I login as viewer',() => {
    cy.login(viewerCredentials.email,viewerCredentials.password)
    cy.url()
        .should('eq','http://localhost:3000/') 
})

When('I navigate to reviews page',() => {
    cy.get('[href="/reviews"]').click()
})

Then('I should be on reviews page',() => {
    cy.url()
        .should('eq','http://localhost:3000/reviews')
})

Given('I login as editor',() => {
    cy.login(editorCredentials.email,editorCredentials.password)
    cy.url().should('eq',"http://localhost:3000/")
})

When('I open home page',() => {
    cy.visit('http://localhost:3000/')
})

Then('I should not see users tab on navbar',() => {
    cy.get('[href="/users"]').should("not.exist")
})

Then('I should not see categories tab on navbar',() => {
    cy.get('[href="/categories"]').should('not.exist')
})

Then('I should not see reviews tab on navbar',() => {
    cy.get('[href="/reviews"]').should('not.exist')
})

When("I change language to Hungarian",() => {
    cy.get('[data-testid="navbar-language-menu"]').should('have.text',"Language")
    cy.get('[data-testid="navbar-language-menu"]').click()
    cy.get('[data-testid="navbar-language-hu"]').click()
})

Then("Language should be Hungarian",() => {
    cy.get('[data-testid="navbar-language-menu"')
        .should('have.text',"Nyelv")
})

When("I change language to English",() => {
    cy.get('[data-testid="navbar-language-menu"]').should('have.text',"Nyelv")
    cy.get('[data-testid="navbar-language-menu"]').click()
    cy.get('[data-testid="navbar-language-en"]').click()
})

Then("Language should be English",() => {
    cy.get('[data-testid="navbar-language-menu"')
        .should('have.text',"Language")
})

When('I press logout',() => {
    cy.get('[data-testid="navbar-account-bubble"]').click()
    cy.get('[data-testid="navbar-logout-menuitem"]').click()
})

Then('I should be on login page',() => {
    cy.url()
        .should('eq','http://localhost:3000/login')
})

When('I press dark or light mode',() => {
    cy.get("#themeSwitcher").click()
})

Then('Style should be dark mode',() => {
    cy.window().then((win) => {
        expect(win.localStorage.getItem('color-mode')).to.equal('dark')
    })
})

Then('Style should be light mode',() => {
    cy.window().then((win) => {
        expect(win.localStorage.getItem('color-mode')).to.equal('light')
    })
})