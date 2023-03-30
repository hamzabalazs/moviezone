Feature: Home Page works as intended
    Scenario: Sorts Movie list by title ascending, then descending
        Given I open home page
        When I sort by title
        Then Movie List should be sorted ascending
        When I sort by title
        Then Movie List should be sorted descending
    Scenario: Searching changes movie list
        Given I open home page
        When Search field is empty
        Then Movie List should have 9 elements
        When I search for a movie
        Then Movie List should change to a single movie
    Scenario: Scrolling to bottom loads more of the movie list
        Given I open home page
        When I scroll to bottom
        Then Movie List should load next elements
    Scenario: Scrolling to bottom when there are no more movies to list does nothing
        Given I open home page
        When I search for a movie
        Then Movie List should change to a single movie
        When I scroll to bottom
        Then Movie List should not load new elements
    Scenario: Choosing a category changes movie list
        Given I open home page
        When I choose a category
        Then Movie list should change to other movies
    Scenario: Clicking on a movie navigates to MoviePage
        Given I open home page
        When I click on a movie
        Then Should navigate to MoviePage of movie
    Scenario: Adding new movie
        Given I open home page
        When I click on add button
        Then Add modal should be open
        When I fill out all the details and submit
        Then Movie should be added
