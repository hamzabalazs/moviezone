Feature: Users page works as intended
    Scenario: Users are listed correctly
        Given I open users page
        When I arrive on users page
        Then I see a list of users
    Scenario: User edit missing first_name
        Given I open users page and go to last user listed
        When I click on edit button of user
        Then Edit modal should open
        When I clear first_name and submit
        Then I should get first_name required error
    Scenario: User edit missing last_name
        Given I open users page and go to last user listed
        When I click on edit button of user
        Then Edit modal should open
        When I clear last_name and submit
        Then I should get last_name required error
    Scenario: User edit missing email
        Given I open users page and go to last user listed
        When I click on edit button of user
        Then Edit modal should open
        When I clear email and submit
        Then I should get email required error
    Scenario: User edit invalid email
        Given I open users page and go to last user listed
        When I click on edit button of user
        Then Edit modal should open
        When I type invalid email and submit
        Then I should get invalid email error
    Scenario: User edit missing password
        Given I open users page and go to last user listed
        When I click on edit button of user
        Then Edit modal should open
        When I clear password and submit
        Then I should get password required error
    Scenario: User edit invalid password
        Given I open users page and go to last user listed
        When I click on edit button of user
        Then Edit modal should open
        When I type short password and submit
        Then I should get invalid password error
    Scenario: User should edit
        Given I open users page and go to last user listed
        When I click on edit button of user
        Then Edit modal should open
        When I change data and submit
        Then User should be edited
    Scenario: User delete modal should close when quit is clicked
        Given I open users page and go to last user listed after edit
        When I click on delete button of user
        Then Delete dialog should open
        When I click on quit
        Then Delete dialog should not be open
    Scenario: User should delete
        Given I open users page and go to last user listed after edit
        When I click on delete button of user
        Then Delete dialog should open
        When I click on accept
        Then User should be deleted