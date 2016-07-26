(function() {
  'use strict';
  var imgcache;

  imgcache = function(opt) {
    var cachedir, debug, fs, getrelativepath, mkdirp, path, request;
    fs = require('fs');
    mkdirp = require('mkdirp');
    path = require('path');
    request = require('request');
    getrelativepath = function(url) {
      url = url.replace(/^(ht|f)tps?:\/\//i, '');
      url = url.replace(/[^\/]+\/\.\.\//g, '');
      url = url.replace(/[^a-z0-9_\.\/-]/gi, '_');
      return url.replace(/\/\./g, '/_');
    };
    opt = opt || {};
    cachedir = opt.cachedir || __dirname + '/imgcache';
    debug = opt.debug || false;
    return {
      clear: function(url, callback) {
        var err, limit, relativedirname, relativepath, rx, sep;
        relativepath = getrelativepath(url);
        try {
          fs.unlinkSync(cachedir + '/' + relativepath);
        } catch (_error) {
          err = _error;
          return callback(err);
        }
        limit = 30;
        relativedirname = '/' + relativepath;
        sep = (path.sep === '/' ? '\\' : '') + path.sep;
        rx = new RegExp(sep + '[^' + sep + ']+' + sep + '?$');
        while ((relativedirname = relativedirname.replace(rx, '')).length > 0 && (--limit > 0)) {
          console.log("relativedirname = " + relativedirname);
          try {
            fs.rmdirSync(cachedir + relativedirname);
          } catch (_error) {
            err = _error;
            if (debug) {
              console.log('Directory Not Empty, only clearing up to ' + relativedirname);
            }
            return callback(false);
          }
        }
        return callback(null);
      },
      get: function(url, callback) {
        var info, self;
        self = this;
        info = {
          'path': cachedir,
          'dirname': '',
          'loadedfromcache': false
        };
        info.path = cachedir + '/' + getrelativepath(url);
        info.dirname = path.dirname(info.path);
        return fs.readFile(info.path, function(err, file) {
          if (!err) {
            info.loadedfromcache = true;
            return callback(err, file, info);
          } else {
            if (debug) {
              console.log('Downloading file: ' + info.path);
            }
            return mkdirp(info.dirname, function(error) {
              if (error) {
                info.error = error;
                if (debug) {
                  console.log('Directory Creation Error: ' + error);
                }
                return callback(error);
              }
              return self.isimage(url, function(err, isimage, response) {
                if (debug) {
                  console.log('isimage response.code: ', response.statusCode);
                }
                if (err) {
                  return callback(err);
                } else if (!isimage) {
                  if (debug) {
                    console.log('NOT AN IMAGE');
                  }
                  return callback("Not an image");
                } else if (response.statusCode !== 200) {
                  if (debug) {
                    console.log('Bad response: ' + response.statusCode);
                  }
                  return callback("Bad response: " + response.statusCode);
                } else {
                  console.log(info);
                  return request(url).pipe(fs.createWriteStream(info.path)).on('close', function() {
                    return fs.readFile(info.path, function(err, file) {
                      return callback(error, file, info);
                    });
                  });
                }
              });
            });
          }
        });
      },
      iscached: function(url) {
        var err, imagepath, stats;
        imagepath = cachedir + '/' + getrelativepath(url);
        try {
          stats = fs.statSync(imagepath);
          return stats.isFile();
        } catch (_error) {
          err = _error;
          if (debug) {
            console.log('iscached? Apparenlty not ' + err);
          }
          return false;
        }
        return false;
      },
      isimage: function(url, callback) {
        return request.head(url, function(err, response) {
          var isimage, rx;
          if (err) {
            callback(err, false);
            return false;
          } else if (!response || !response.headers || !response.headers['content-type']) {
            callback("Error: unexpected response");
            return false;
          } else {
            rx = new RegExp("image", "i");
            isimage = rx.test(response.headers['content-type']);
            callback(null, isimage, response);
            return isimage;
          }
        });
      }
    };
  };

  return imgcache;

}).call(this);
