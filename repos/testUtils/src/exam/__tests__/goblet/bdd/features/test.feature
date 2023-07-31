@add @world
Feature: Add to world
  As a math wiz
  In order to show my math skills
  I want to add a number to the world
  
  Scenario: Add a number to the world.number property
    Given I have 1 as $:world.number
    When I add 1 to $:world.number
    Then I expect $:world.number to be 2