Feature: Register user
    Scenario: Register without any data
        Given I open register page
        When I submit without any data
        Then I should get error for every field
    Scenario: Register without first name
        Given I open register page
        When I submit without first name
        Then I should get required first name error
    Scenario: Register without last name
        Given I open register page
        When I submit without last name
        Then I should get required last name error
    Scenario: Register without email
        Given I open register page
        When I submit without email
        Then I should get required email error
    Scenario: Register without password
        Given I open register page
        When I submit without password
        Then I should get required password error
    Scenario: Register with invalid email
        Given I open register page
        When I submit with wrong email format
        Then I should get invalid email error
    Scenario: Register with invalid password
        Given I open register page
        When I submit with short password
        Then I should get invalid password error
    Scenario: Register with existing data
        Given I open register page
        When I submit with existing data
        Then I should get already exists error
    Scenario: Valid registration
        Given I open register page
        When I submit with good data
        Then I should see login page
        When I login with registered data
        Then I should see main page