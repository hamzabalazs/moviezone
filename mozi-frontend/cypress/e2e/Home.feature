Feature: Home Page
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