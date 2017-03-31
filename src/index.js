"use strict";
var sf = require('sf-core');
var Autocomplete = require('./sf-autocomplete').default;

// TODO not use webpack's style loader here. just compile, minify and add to the page by our script
require("./autocomplete.less");

sf.instancesController.registerInstanceType(Autocomplete, "js-sf-autocomplete");

module.exports = Autocomplete;   // ES6 default export will not expose us as global
