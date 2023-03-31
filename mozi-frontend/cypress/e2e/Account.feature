Feature: Account page works as intended
    Scenario: I can reach account page
        Given I login as test user
        When I click on accounts page
        Then I should be on accounts page
    Scenario: I can edit my user data
        Given I login as test user
        When I click on accounts page
        Then I should be on accounts page
        When I click on user edit
        Then I should see user edit modal
        When I submit without first name
        Then I should get first name required error
        When I submit without last name
        Then I should get last name required error
        When I submit without email
        Then I should get email required error
        When I submit with invalid email
        Then I should get invalid email error
        When I submit without password
        Then I should get password required error
        When I submit with invalid password
        Then I should get invalid password error
        When I submit with edited data
        Then I should see my edited data after edit
    Scenario: Login with edited data
        Given I login as test user with edited values
        When I click on accounts page
        Then I should see my edited data
    Scenario: I can delete my user data
        Given I login as test user with edited values
        When I click on accounts page
        Then I should be on accounts page
        When I click on user delete
        Then I should see user delete dialog
        When I click quit deletion
        Then I should not see user delete dialog
        When I click on user delete
        Then I should see user delete dialog
        When I click accept deletion
        Then I should navigate to login page
        When I login as test user with edited values
        Then I should get not exist error