Feature: Forgot password page works as intended
    Scenario: Navigate to login
        Given I open forgot password page
        When I click login link
        Then I should be on login page
    Scenario: Forgot password missing email
        Given I open forgot password page
        When I submit without email
        Then I should get email required error
    Scenario: Non existing email input
        Given I open forgot password page
        When I submit with non existing email
        Then I should get email does not exist error
    Scenario: Existing email input
        Given I open forgot password page
        When I submit with existing email
        Then I should get success message and navigate to login