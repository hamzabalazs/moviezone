import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { adminCredentials, baseUrl, testMovie } from '../../support/e2e'
import { DESCRIPTION_REQUIRED_MESSAGE, NAME_REQUIRED_MESSAGE } from '../../support/errormessages';

const testCast = {
    name:"test",
    photo:"photo",
    description:"test"
}

const testEditCast = {
    name:"testEdited",
    description:"testEdited"
}

before(() => {
    cy.getAdminToken().then((resp) => {
        const token = resp.body.data.logIn.token;
        cy.addMovie(testMovie, token).then((movie) => {
            cy.addCast(testCast,movie.body.data.createMovie.id,token)
        });
      });
})

after(() => {
    cy.getAdminToken().then((resp) => {
        const token = resp.body.data.logIn.token;
        cy.deleteMovie(testMovie.title,token)
    })
})

Given('I open movie page of test movie',() => {
    cy.login(adminCredentials.email,adminCredentials.password);
    cy.wait(300)
    cy.url().should('eq',baseUrl)
    cy.get('#searchValue').type(testMovie.title)
    cy.wait(500)
    cy.get('[data-testid="movie-list-card"]').first().click()
    cy.url().should('include',baseUrl + 'movie/')
})

When('I click on first cast member',() => {
    cy.get('[data-testid="cast-card"]').first().click()
})

Then('I should be on cast page of cast member',() => {
    cy.url().should('include',baseUrl + "cast/")
})

Given('I open cast page of test cast member',() => {
    cy.login(adminCredentials.email,adminCredentials.password);
    cy.wait(300)
    cy.url().should('eq',baseUrl)
    cy.get('#searchValue').type(testMovie.title)
    cy.wait(500)
    cy.get('[data-testid="movie-list-card"]').first().click()
    cy.url().should('include',baseUrl + 'movie/')
    cy.get('[data-testid="cast-card"]').first().click()
    cy.wait(300)
    cy.url().should('include',baseUrl + "cast/")
})

When('I arrive on page',() => {
    cy.url().should('include',baseUrl + "cast/")
})

Then('I should see atleast one movie in the featured in list',() => {
    cy.get('[data-testid="movie-list-card"]').should('have.length.at.least',1)
})

When('I click on cast edit button',() => {
    cy.get('[data-testid="castpage-edit-button"]').click()
})

Then('I should see cast edit modal',() => {
    cy.get('[data-testid="movie-cast-edit-modal"]').should('exist')
})

When('I submit without name',() => {
    cy.get('#name').clear()
    cy.get('#description').clear().type(testEditCast.description)
    cy.get('[data-testid="movie-edit-cast"]').click()
})

Then('I should get name required error',() => {
    cy.get('[data-testid="movie-edit-cast-errors"]').should('have.text',NAME_REQUIRED_MESSAGE)
})

When('I submit without description',() => {
    cy.get('#name').clear().type(testEditCast.name)
    cy.get('#description').clear()
    cy.get('[data-testid="movie-edit-cast"]').click()
})

Then('I should get description required error',() => {
    cy.get('[data-testid="movie-edit-cast-errors"]').should('have.text',DESCRIPTION_REQUIRED_MESSAGE)

})

When('I submit with correct values',() => {
    cy.get('#name').clear().type(testEditCast.name)
    cy.get('#description').clear().type(testEditCast.description)
    cy.get('[data-testid="movie-edit-cast"]').click()
})

Then('I should see cast with modified data',() => {
    cy.get('[data-testid="movie-cast-edit-modal"]').should('not.exist')
    cy.get('[data-testid="castpage-name"]').should('have.text',testEditCast.name)
    cy.get('[data-testid="castpage-description"]').should('have.text',"Description: "+testEditCast.description)
})

When('I click on the first movie in list',() => {
    cy.get('[data-testid="movie-list-card"]').first().click()
    cy.wait(300)
})

Then('I should be on a movies page',() => {
    cy.url().should('include', baseUrl + 'movie/')
})

When('I click on cast delete button',() => {
    cy.get('[data-testid="castpage-delete-button"]').click()
})

Then('I should see cast delete dialog',() => {
    cy.get('[data-testid="cast-delete-dialog"]').should('exist')
})

When('I click quit',() => {
    cy.get('[data-testid="cast-delete-quit"]').click()
})

Then('I should not see cast delete dialog',() => {
    cy.get('[data-testid="cast-delete-dialog"]').should('not.exist')
})

When('I click accept',() => {
    cy.get('[data-testid="cast-delete-accept"]').click()
    cy.wait(300)
})

Then('I should be back on movies page',() => {
    cy.url().should('include', baseUrl + 'movie/')
})