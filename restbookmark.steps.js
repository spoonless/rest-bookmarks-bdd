var rest = require("rest")
var mime = require('rest/interceptor/mime');

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

var bookmarkSteps = function() {
  
  var bookmark;
  var response;
  
  this.Given('a bookmark with the following content:', function(bookmarkTable, callback) {
    bookmark = bookmarkTable.hashes()[0];
    callback();
  });
  
  this.When('I create the bookmark', function (callback) {
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

  this.Then('the bookmark is now the latest', function (callback) {
    client.withLatestBookmark(function(r) {
      if (bookmark.name != r.entity.name || bookmark.description != r.entity.description || bookmark.url != r.entity.url) {
        callback(new Error("Unexpected latest bookmark: " + r.entity));
      }
      else {
        callback();
      }
    });
  });

  this.Then('the bookmark is created', function (callback) {
    if(response.status.code != 201) {
      callback.fail(new Error("Invalid HTTP status code " + response.status.code));
    }
    else {
      callback();
    }
  });

  this.Then('the bookmark is not created', function (callback) {
    if(response.status.code == 201) {
      callback.fail(new Error("Invalid HTTP status code " + response.status.code));
    }
    else {
      callback();
    }
  });

  this.Then('the HTTP status code is $code', function (code, callback) {
    if(response.status.code != parseInt(code)) {
      callback.fail(new Error("Invalid HTTP status code " + response.status.code));
    }
    else {
      callback();
    }
  });

  this.Then('the server provides an URI for the bookmark', function (callback) {
    if(! response.headers['Location']) {
      callback.fail(new Error("No header location find for the bookmark in the server response"));
    }
    else {
      client(response.headers['Location']).then(function(r) {
        if (r.status.code != 200) {
          callback.fail(new Error("No header location find for the bookmark in the server response"));
        }
        else {
          callback();
        }
      });
    }
  });

}

module.exports = bookmarkSteps;
