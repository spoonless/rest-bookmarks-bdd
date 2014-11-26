
Feature: bookmark creation

Scenario: Creating one bookmark
  Given a bookmark with the following content:
  |name       |description      |url               |
  |mybookmark|boorkmark for test|http://example.com|

  When I create the bookmark
  Then the bookmark is created
  And the server provides an URI for the bookmark
  And the bookmark is now the latest

Scenario: Bookmark cannot be created if no name is provided
  Given a bookmark with the following content:
  |name       |description       |url               |
  |           |boorkmark for test|http://example.com|

  When I create the bookmark
  Then the bookmark is not created
  And the HTTP status code is 400

Scenario: Bookmark cannot be created if no URL is provided
  Given a bookmark with the following content:
  |name       |description       |url               |
  |mybookmark |boorkmark for test|                  |

  When I create the bookmark
  Then the bookmark is not created
  And the HTTP status code is 400

Scenario: Bookmark can be created if no description is provided
  Given a bookmark with the following content:
  |name       |description       |url               |
  |mybookmark |                  |http://example.com|

  When I create the bookmark
  When I create the bookmark
  Then the bookmark is created
