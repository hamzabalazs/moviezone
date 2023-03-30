Feature: Categories page works as intended
    Scenario: Categories are listed correctly
        Given I open categories page
        When I arrive on page
        Then Categories should be loaded
    Scenario: Add Category
        Given I open categories page
        When I press category add button
        Then Add modal should open
        When I fill out data and submit
        Then New category should be added
    Scenario: Category should edit
        Given I open categories page
        When I press category edit button
        Then Edit modal should open
        When I change name and submit
        Then Category should be edited
    Scenario: Category should delete
        Given I open categories page
        When I press category delete button
        Then Delete dialog should open
        When I press accept button to delete
        Then Category should be deleted