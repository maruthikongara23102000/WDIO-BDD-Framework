Feature: The Internet Guinea Pig Website

  @smoke @sanity
  Scenario: As a user, I can log into the secure area
    Given I am on the login page
    When I login with tomsmith and SuperSecretPassword!
    Then I should see a valid login message

  @regression
  Scenario: As a user, I receive an invalid login message
    Given I am on the login page
    When I login with foobar and barfoo
    Then I should see an invalid login message
