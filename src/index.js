"use strict";
import sf from 'sf';//resolved by webpack's "externals"
import Autocomplete from './sf-autocomplete';

//todo not use webpack's style loader here. just compile, minify and add to the page by our script
require("style!css?minimize!less!./autocomplete.less");

sf.instancesController.registerInstanceType(Autocomplete, "js-sf-autocomplete");
module.exports = Autocomplete;   // ES6 default export will not expose us as global