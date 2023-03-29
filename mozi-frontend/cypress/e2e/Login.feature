Feature: Login to Application
    Scenario: Missing password and email
        Given I open login page
        When I submit login without email and password
        Then I should get two required errors
    Scenario: Missing password
        Given I open login page
        When I submit login without password
        Then I should get password required error
    Scenario: Missing email
        Given I open login page
        When I submit login without email
        Then I should get email required error
    Scenario: Bad credentials
        Given I open login page
        When I submit login with bad credentials
        Then I should get user not found error
    Scenario: Invalid email
        Given I open login page
        When I submit login with invalid email
        Then I should get invalid email error
    Scenario: Invalid password
        Given I open login page
        When I submit login with invalid password
        Then I should get invalid password error
    Scenario: Valid login
        Given I open login page
        When I submit login
        Then I should see homepage