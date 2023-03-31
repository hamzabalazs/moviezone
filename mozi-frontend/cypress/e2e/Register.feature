Feature: Register user
    Scenario: Register error handling
        Given I open register page
        When I submit without any data
        Then I should get error for every field
        When I submit without first name
        Then I should get required first name error
        When I submit without last name
        Then I should get required last name error
        When I submit without email
        Then I should get required email error
        When I submit without password
        Then I should get required password error
        When I submit with wrong email format
        Then I should get invalid email error
        When I submit with short password
        Then I should get invalid password error
    Scenario: Valid registration
        Given I open register page
        When I submit with good data
        Then I should see login page
        When I login with registered data
        Then I should see main page