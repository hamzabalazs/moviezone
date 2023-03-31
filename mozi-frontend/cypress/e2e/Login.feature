Feature: Login to Application
    Scenario: Navigate to register page
        Given I open login page
        When I click on register link
        Then I should be on register page
    Scenario: Navigate to forgot password page
        Given I open login page
        When I click on forgot password link
        Then I should be on forgot password page
    Scenario: Login error handling
        Given I open login page
        When I submit login without email and password
        Then I should get two required errors
        When I submit login without password
        Then I should get password required error
        When I submit login without email
        Then I should get email required error
        When I submit login with bad credentials
        Then I should get user not found error
        When I submit login with invalid email
        Then I should get invalid email error
        When I submit login with invalid password
        Then I should get invalid password error
    Scenario: Valid login
        Given I open login page
        When I submit login
        Then I should see homepage