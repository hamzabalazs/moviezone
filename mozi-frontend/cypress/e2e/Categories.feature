Feature: Categories page works as intended
    Scenario: Categories are listed correctly
        Given I open categories page
        When I arrive on page
        Then I see a list of categories
    Scenario: Add Category
        Given I open categories page
        When I press category add button
        Then Add modal should open
        When I leave fields blank and submit
        Then I should get name required error add
        When I fill out data and submit
        Then New category should be added
    Scenario: Category edit works as intended
        Given I open categories page
        When I press category edit button
        Then Edit modal should open
        When I clear name and submit
        Then I should get name required error edit
        When I change name and submit
        Then Category should be edited
    Scenario: Category delete modal closes when quit button is clicked
        Given I open categories page
        When I press category delete button
        Then Delete dialog should open
        When I press quit button
        Then Delete dialog should not be open
    Scenario: Category should delete
        Given I open categories page
        When I press category delete button
        Then Delete dialog should open
        When I press accept button to delete
        Then Category should be deleted