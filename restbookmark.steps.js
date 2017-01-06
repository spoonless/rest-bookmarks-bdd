var cucumber = require('cucumber');
var rest = require("rest")
var mime = require("rest/interceptor/mime");

var apiUrl = "http://rest-bookmarks.herokuapp.com/api/bookmarks";

client = rest.wrap(mime);

client.withLatestBookmark = function(callback) {
   client({
      "path": apiUrl,
      "method":"HEAD"})
    .then(function(r) {
        var matches = /<([^>]+)>; rel="current"/.exec(r.headers["Link"])
        if (!matches || !matches[1]) {
          throw new Error("Cannot find Link header with rel=\"current\" in " + response.headers);
        }
        var latestUrl = matches[1];
        return client({"path": latestUrl, "headers" : {"accept": "application/json"}}).then(callback);
    });
 }

cucumber.defineSupportCode(function({Given, When, Then}) {

  var bookmark;
  var response;

  Given('a bookmark with the following content:', function(bookmarkTable, callback) {
    bookmark = bookmarkTable.hashes()[0];
    callback();
  });

  When('I create the bookmark', function (callback) {
    client({
      "path": apiUrl,
      "headers":{"Content-Type":"application/json"},
      "method":"POST",
      "entity": bookmark})
    .then(function(r) {
        response = r;
        callback();
    });
  });

  Then('the bookmark is now the latest', function (callback) {
    client.withLatestBookmark(function(r) {
      if (bookmark.name != r.entity.name || bookmark.description != r.entity.description || bookmark.url != r.entity.url) {
        callback(new Error("Unexpected latest bookmark: " + r.entity));
      }
      else {
        callback();
      }
    });
  });

  Then('the bookmark is created', function () {
    if(response.status.code != 201) {
      throw new Error("Invalid HTTP status code " + response.status.code)
    }
  });

  Then('the bookmark is not created', function () {
    if(response.status.code == 201) {
      throw new Error("Invalid HTTP status code " + response.status.code);
    }
  });

  Then('the HTTP status code is {code:int}', function (code) {
    if(response.status.code != code) {
      throw new Error("Invalid HTTP status code " + response.status.code);
    }
  });

  Then('the server has sent back the message {message:stringInDoubleQuotes}', function (message) {
    if(response.entity != message) {
      throw new Error("Invalid server response: " + response.entity);
    }
  });

  Then('the server provides an URI for the bookmark', function (callback) {
    if(! response.headers['Location']) {
      callback(new Error("No header location find for the bookmark in the server response"));
    }
    else {
      client(response.headers['Location']).then(function(r) {
        if (r.status.code != 200) {
          callback(new Error("No header location find for the bookmark in the server response"));
        }
        else {
          callback();
        }
      });
    }
  });
});
