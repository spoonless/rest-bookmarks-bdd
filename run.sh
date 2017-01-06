#!/bin/bash

"$(dirname $0)/node_modules/cucumber/bin/cucumber.js" create-bookmark.feature -r restbookmark.steps.js -f pretty
