Acceptance testing with cucumber.js
===================================

There are some acceptance tests for the demo application http://rest-bookmarks.herokuapp.com/.
The source code of the demo application is available in this [repo](https://github.com/spoonless/rest-bookmarks).

This project is based on cucumber-js. Therefore once you have installed npm and node.js, you have

to install cucumber globally:
> npm install -g cucumber

to install project dependencies:
> npm install

and then to run the feature:
> cucumber.js create-bookmark.feature -r restbookmark.steps.js -f pretty


