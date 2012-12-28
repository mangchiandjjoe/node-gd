// Generated by CoffeeScript 1.4.0
var format, formats, fs, gd_bindings, open_func, p, save_func, util, v;

open_func = function(format, len) {
  return function() {
    var args, callback, filename;
    args = Array.prototype.slice.call(arguments);
    filename = args.shift();
    callback = args[len - 1];
    if (typeof callback !== "function") {
      return gd_bindings["createFrom" + format].apply(arguments);
    }
    args.pop();
    return fs.readFile(filename, "binary", function(err, data) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, gd_bindings["createFrom" + format + "Ptr"](data));
      }
    });
  };
};

save_func = function(format, len) {
  format = format.toLowerCase();
  return function() {
    var args, callback, data, filename;
    args = Array.prototype.slice.call(arguments);
    filename = args.shift();
    callback = args[len - 1];
    if (typeof callback !== "function") {
      return this[format].apply(this, arguments);
    }
    data = this[format + "Ptr"].apply(this, args);
    return fs.writeFile(filename, data, "binary", callback);
  };
};

util = require('util');

fs = require('fs');

try {
  gd_bindings = require(__dirname + '/../build/Release/node-gd');
} catch (e) {
  gd_bindings = require(__dirname + '/../build/default/node-gd');
}

for (p in gd_bindings) {
  if (typeof gd_bindings[p] !== 'undefined') {
    exports[p] = gd_bindings[p];
  }
}

formats = {
  jpeg: [1, 2],
  png: [1, 2],
  gif: [1, 1],
  gd: [1, 1],
  gd2: [1, 1],
  gd2Part: [5, -1],
  WBMP: [1, 1]
};

for (format in formats) {
  v = formats[format];
  format = format.replace(/^[a-z]/, function(m0) {
    return m0.toUpperCase();
  });
  if (v[0] >= 0) {
    exports["open" + format] = open_func(format, v[0]);
  }
  if (v[1] >= 0) {
    gd_bindings.Image.prototype["save" + format] = save_func(format, v[1]);
  }
}
