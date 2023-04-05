Feature: Dashboard works as intended
    Scenario: I cannot see dashboard page as viewer
        Given I login as viewer
        When I click on account bubble
        Then I should not find dashboard inside menu
    Scenario: I cannot see dashboard page as editor
        Given I login as editor
        When I click on account bubble
        Then I should not find dashboard inside menu
    Scenario: I can open dashboard page as admin
        Given I login as admin
        When I click on account bubble
        Then I should see dashboard inside menu
        When I click on dashboard
        Then I should be on dashboard page
    Scenario: Dashboard page tabs functionality
        Given I open dashboard page as admin
        When I click on review tab
        Then I should see review tab content
        When I click on category tab
        Then I should see category tab content
        When I click on movie tab
        Then I should see movie tab content
