import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

beforeEach(() => {
    cy.login("admin@example.com","admin")
})

Given('I open home page',() => {
    cy.url()
        .should('eq','http://localhost:3000/')
})

When('I sort by title',() => {
    cy.get('#sort-button').click()
    cy.get('#sort-title').click()
    cy.wait(50)
})

Then('Movie List should be sorted ascending',() => {
    cy.get('[data-testid="movie-list-card-title"]').then(($titles) => 
        $titles.map(function(){
            return this.outerText
        }),
    ).then((list) => {
        return list.toArray()
    })
    .should('be.an','array')
    .then((list) => {
        const sorted = Cypress._.sortBy(list)
        expect(sorted).to.deep.equal(list)
    })

})

Then('Movie List should be sorted descending',() => {
    cy.get('[data-testid="movie-list-card-title"]').then(($titles) => 
        $titles.map(function(){
            return this.outerText
        }),
    ).then((list) => {
        return list.toArray()
    })
    .should('be.an','array')
    .then((list) => {
        const sorted = Cypress._.sortBy(list.reverse())
        expect(sorted).to.deep.equal(list)
    })
})

When('Search field is empty',() => {
    cy.get('#searchValue').should('be.empty')
})

Then('Movie List should have 9 elements',() => {
    cy.get('[data-testid="movie-list-card"]').should('have.length',9)
})

When('I search for a movie',() => {
    cy.get('#searchValue').type("All Quiet on The Western Front")
    cy.wait(500)
})

Then('Movie List should change to a single movie',() => {
    cy.get('[data-testid="movie-list-card"]').should('have.length',1)
})