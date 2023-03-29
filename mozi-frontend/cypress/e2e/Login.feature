Feature: Login to Application
    Scenario: Valid login
        Given I open login page
        When I submit login
        Then I should see homepage