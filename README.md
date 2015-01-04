Acceptance testing with cucumber.js
===================================

There are some acceptance tests for the demo application http://rest-bookmarks.herokuapp.com/

This project is based on cucumber-js. Therefore once you have installed npm and node.js run

  npm install -g cucumber

to install cucumber globally and then

  npm install

to install project depedency

To run the feature :

  cucumber.js create-bookmark.feature -r restbookmark.steps.js -f pretty


