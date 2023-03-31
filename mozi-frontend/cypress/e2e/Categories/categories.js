import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const newCategoryName = "test";
const editCategoryName = "testEDITED";

beforeEach(() => {
  cy.login("admin@example.com", "admin");
});

Given("I open categories page", () => {
  cy.get('[href="/categories"]').click();
});

When("I arrive on page", () => {
  cy.url().should("eq", "http://localhost:3000/categories");
  cy.wait(300);
});

Then("I see a list of categories", () => {
  cy.get('[data-testid="category-card"]').should("have.length.at.least", 1);
});

When("I press category add button", () => {
  cy.get('[data-testid="category-add-button"]').click();
});

Then("Add modal should open", () => {
  cy.get('[data-testid="category-add-card"]').should("be.visible");
});

When("I leave fields blank and submit", () => {
  cy.get('[data-testid="category-add"]').click();
});

Then("I should get name required error add", () => {
  cy.get('[data-testid="category-add-error-name"]')
    .should("be.visible")
    .should("have.text", "Category name is required!");
});

When("I fill out data and submit", () => {
  cy.get("#name").type(newCategoryName);
  cy.get('[data-testid="category-add"]').click();
});

Then("New category should be added", () => {
  cy.get('[data-testid="category-card-name"]').last().should("have.text", newCategoryName);
});

When("I press category edit button", () => {
  cy.get('[data-testid="category-card-edit-button"]').last().click();
});

Then("Edit modal should open", () => {
  cy.get('[data-testid="category-edit-card"]').should("be.visible");
});

When("I clear name and submit", () => {
  cy.get("#name").should("have.value", "test").clear();
  cy.get('[data-testid="category-edit-modal-edit"]').click();
});

Then("I should get name required error edit", () => {
  cy.get('[data-testid="category-edit-error-name"]')
    .should("be.visible")
    .should("have.text", "Name is required!");
});

When("I change name and submit", () => {
  cy.get("#name").clear().type(editCategoryName);
  cy.get('[data-testid="category-edit-modal-edit"]').click();
});

Then("Category should be edited", () => {
  cy.get('[data-testid="category-card-name"]')
    .last()
    .should("have.text", editCategoryName);
});

When("I press category delete button", () => {
  cy.get('[data-testid="category-card-delete-button"]').last().click();
});

Then("Delete dialog should open", () => {
  cy.get('[data-testid="category-delete-dialog"]').should("exist");
});

When("I press accept button to delete", () => {
  cy.get('[data-testid="category-delete-dialog-accept"]').click();
});

Then("Category should be deleted", () => {
  cy.get('[data-testid="category-card-name"]')
    .last()
    .should("not.have.value", editCategoryName);
});

When("I press quit button", () => {
  cy.get('[data-testid="category-delete-dialog-quit"]').click();
});

Then("Delete dialog should not be open", () => {
  cy.get('[data-testid="category-delete-dialog"]').should("not.exist");
});
