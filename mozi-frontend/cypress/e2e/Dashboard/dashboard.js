import { Given, When, Then} from '@badeball/cypress-cucumber-preprocessor'
import { adminCredentials, baseUrl, editorCredentials, viewerCredentials } from '../../support/e2e'

Given('I login as editor',() => {
    cy.login(editorCredentials.email,editorCredentials.password)
    cy.wait(300)
    cy.url().should('eq',baseUrl)
})

Given('I login as viewer',() => {
    cy.login(viewerCredentials.email,viewerCredentials.password)
    cy.wait(300)
    cy.url().should('eq',baseUrl)
})

Given('I login as admin',() => {
    cy.login(adminCredentials.email,adminCredentials.password)
    cy.wait(300)
    cy.url().should('eq',baseUrl)
})

When('I click on account bubble',() => {
    cy.get('[data-testid="navbar-account-bubble"]').click()
})

Then('I should not find dashboard inside menu',() => {
    cy.get('[data-testid="navbar-account-dashboard"]').should('not.exist')
})

Then('I should see dashboard inside menu',() => {
    cy.get('[data-testid="navbar-account-dashboard"]').should('exist')
})

When('I click on dashboard',() => {
    cy.get('[data-testid="navbar-account-dashboard"]').click()
})

Then('I should be on dashboard page',() => {
    cy.url().should('eq',baseUrl + 'dashboard')
})

Given('I open dashboard page as admin',() => {
    cy.login(adminCredentials.email,adminCredentials.password);
    cy.wait(300)
    cy.get('[data-testid="navbar-account-bubble"]').click()
    cy.get('[data-testid="navbar-account-dashboard"]').click()
    cy.url().should('eq',baseUrl + 'dashboard')
})

When('I click on review tab',() => {
    cy.get('#reviewTab').click()
})

Then('I should see review tab content',() => {
    cy.get('[data-testid="movie-autocomplete"]').should('exist').click()
    cy.get('ul>li').first().click()
    cy.get('#chartNr').should('exist')
    cy.get('#chartAvg').should('exist')
})

When('I click on category tab',() => {
    cy.get('#categoryTab').click()
})

Then('I should see category tab content',() => {
    cy.get('#mChartNrCat').should('exist')
})

When('I click on movie tab',() => {
    cy.get('#movieTab').click()
})

Then('I should see movie tab content',() => {
    cy.get('#mChartNrYear').should('exist')
})
