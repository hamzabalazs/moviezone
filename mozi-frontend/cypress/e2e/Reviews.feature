Feature: Review page works as intended
    Scenario: First three reviews are listed when going on reviews page
        Given I open reviews page
        When I arrive on page
        Then I should see at most three reviews
    Scenario: Scrolling to bottom of page loads more reviews
        Given I open reviews page
        When I scroll to bottom
        Then I should see at most six reviews
    Scenario: Review Edit works as intended
        Given I open reviews page and scroll to last review
        When I click on review edit button
        Then I should see review edit modal
        When I submit without description
        Then I should get description required error
        When I submit with correct data
        Then I should see edited review
    Scenario: Review Delete closes after quit is clicked
        Given I open reviews page and scroll to last review after edit
        When I click on review delete button
        Then I should see review delete dialog
        When I click quit
        Then I should not see review delete dialog
        When I click on review delete button
        Then I should see review delete dialog
        When I click accept
        Then Review should be deleted