Feature: Cast page works as intended
    Scenario: When I click on a cast member, I navigate to cast page
        Given I open movie page of test movie
        When I click on first cast member
        Then I should be on cast page of cast member
    Scenario: Atleast one movie should show in the featured in section
        Given I open cast page of test cast member
        When I arrive on page
        Then I should see atleast one movie in the featured in list
    Scenario: Cast edit error handling
        Given I open cast page of test cast member
        When I click on cast edit button
        Then I should see cast edit modal
        When I submit without name
        Then I should get name required error
        When I submit without description
        Then I should get description required error
    Scenario: Cast edit works
        Given I open cast page of test cast member
        When I click on cast edit button
        Then I should see cast edit modal
        When I submit with correct values
        Then I should see cast with modified data
    Scenario: Featured movies link correctly
        Given I open cast page of test cast member
        When I click on the first movie in list
        Then I should be on a movies page
    Scenario: Cast delete works
        Given I open cast page of test cast member
        When I click on cast delete button
        Then I should see cast delete dialog
        When I click quit
        Then I should not see cast delete dialog
        When I click on cast delete button
        Then I should see cast delete dialog
        When I click accept
        Then I should be back on movies page