Feature: Movie page works as intended
    Scenario: When I click on a movie I navigate to Movie page
        Given I open home page
        When I click on test movie
        Then I should be on movie page of test movie
    Scenario: Movie reviews list correctly
        Given I open movie page
        When I arrive on movie page
        Then List should be empty
    Scenario: Movie add review
        Given I open movie page
        When I rate movie without rating
        Then I should get rating required error
        When I rate movie without description
        Then I should get description required error review add
        When I rate movie
        Then List should have one element
        When I rate movie again
        Then I should get movie already rated by user error
    Scenario: Movie edit review
        Given I open movie page
        When I click edit button on review
        Then I should see review edit modal
        When I submit without review description 
        Then I should get description required error review
        When I submit with edited data review
        Then I should see edited review
    Scenario: Movie delete review
        Given I open movie page
        When I click delete button on review
        Then I should see review delete dialog
        When I click quit review
        Then I should not see review delete dialog
        When I click delete button on review
        Then I should see review delete dialog
        When I click accept review
        Then List should be empty
    Scenario: Movie Edit error handling
        Given I open movie page
        When I click on movie edit button
        Then I should see movie edit modal
        When I submit without title
        Then I should get title required error
        When I submit without description
        Then I should get description required error
        When I submit without release date
        Then I should get release date required error
        When I submit with invalid release date
        Then I should get invalid release date error
    Scenario: Movie Edit successful
        Given I open movie page
        When I click on movie edit button
        Then I should see movie edit modal
        When I submit with edited data
        Then I should see edited movie
    Scenario: Movie Delete Dialog works as intended
        Given I open movie page
        When I click on movie delete button
        Then I should see movie delete dialog
        When I click quit
        Then I should not see movie delete dialog
        When I click on movie delete button
        Then I should see movie delete dialog
        When I click accept
        Then I should navigate to main page and movie should delete