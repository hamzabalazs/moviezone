Feature: Navigation Bar works as intended
    Scenario: Navigate to category
        Given I login as admin
        When I navigate to category page
        Then I should be on category page
    Scenario: Navigate to user
        Given I login as admin
        When I navigate to users page
        Then I should be on users page
    Scenario: Navigate to account
        Given I login as admin
        When I navigate to account page
        Then I should be on account page
    Scenario: Navigate to reviews
        Given I login as viewer
        When I navigate to reviews page
        Then I should be on reviews page
    Scenario: Change Language to Hungarian then back to English
        Given I login as admin
        When I change language to Hungarian
        Then Language should be Hungarian
        When I change language to English
        Then Language should be English
    Scenario: Log out
        Given I login as admin
        When I press logout
        Then I should be on login page
    Scenario: Change to dark mode then back to light mode
        Given I login as admin
        When I press dark or light mode
        Then Style should be dark mode
        When I press dark or light mode
        Then Style should be light mode
    