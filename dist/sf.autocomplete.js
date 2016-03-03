/*!
 * Autocomplete module v.0.1.0
 * https://github.com/sfjs/sf-module-autocomplete/
 * Copyright (c) 2016, Alex Chepura, Yauheni Yasinau, Maxim Matveev, spiralscout.com
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("sf"));
	else if(typeof define === 'function' && define.amd)
		define(["sf"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("sf")) : factory(root["sf"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _sf = __webpack_require__(2);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	var _sfAutocomplete = __webpack_require__(3);
	
	var _sfAutocomplete2 = _interopRequireDefault(_sfAutocomplete);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//todo not use webpack's style loader here. just compile, minify and add to the page by our script
	__webpack_require__(27); //resolved by webpack's "externals"
	
	
	_sf2.default.instancesController.registerInstanceType(_sfAutocomplete2.default, "js-sf-autocomplete");
	module.exports = _sfAutocomplete2.default; // ES6 default export will not expose us as global

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;
	
	var _getOwnPropertyNames = __webpack_require__(4);
	
	var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);
	
	var _assign = __webpack_require__(20);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _create = __webpack_require__(25);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _sf = __webpack_require__(2);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//resolved by webpack's "externals"
	
	var Autocomplete = function Autocomplete(sf, node, options) {
	    this._construct(sf, node, options);
	};
	Autocomplete.prototype = (0, _create2.default)(_sf2.default.core.BaseDOMConstructor.prototype);
	Autocomplete.prototype.name = "autocomplete";
	Autocomplete.prototype._construct = function (sf, node, options) {
	    this.init(sf, node, options); //call parent
	
	    var defaults = {
	        /*NOT REQUIRED OPTIONS*/
	        /*delimiter: "",*/
	    };
	    this.options = (0, _assign2.default)(this.options, defaults);
	    if (options) {
	        //if we pass options extend all options by passed options
	        this.options = (0, _assign2.default)(this.options, options);
	    }
	
	    /*INITIAL VARIABLES*/
	    /**
	     * @default false
	     * */
	    this.filled = false;
	    /**
	     * @default -1
	     * */
	    this.selectedIndex = -1;
	
	    this.els = {
	        node: node,
	        input: node,
	        wrapper: sf.helpers.domTools.closest(node, this.options.wrapperSelector),
	        group: node.parentNode,
	        hidden: document.createElement('input'),
	        hints: null,
	        addon: document.createElement("button")
	    };
	    this.els.input.autocomplete = "off";
	    this.els.wrapper.appendChild(this.els.hidden);
	    this.els.hidden.setAttribute('type', 'hidden');
	    this.els.hidden.name = this.els.input.dataset.name;
	    if (this.els.input.dataset.value) this.els.hidden.value = this.els.input.dataset.value;
	    this.els.addon.className = "btn-icon";
	    this.els.addon.setAttribute("type", "button");
	    this.els.group.appendChild(this.els.addon);
	    if (this.options.url[this.options.url.length - 1] === "/") {
	        this.options.url = this.options.url.substring(0, this.options.url.length - 1);
	    }
	
	    this.value = this.els.input.value;
	    this.key = this.els.input.dataset.key;
	
	    if (this.key && this.value) {
	        this.setState("filled");
	    } else {
	        this.setState("search");
	    }
	
	    if (this.options.availableTags && !this.options.url) {
	        this.options.deferRequestBy = 0;
	    }
	
	    this.addEventListeners();
	};
	
	Autocomplete.prototype._key = "";
	
	/**
	 * @override
	 * @inheritDoc
	 * @enum {string}
	 */
	Autocomplete.prototype.optionsToGrab = {
	    /**
	     * URL to get suggestions form <b>Default: "/"</b>
	     */
	    url: {
	        value: "/",
	        domAttr: "data-url"
	    },
	    /**
	     *  Accept or not values that not present in suggestions <b>Default: "false"</b>
	     */
	    allowNew: {
	        value: false,
	        domAttr: "data-allow-new"
	    },
	    /**
	     * Name to send <b>Default: "autocomplete"</b>
	     */
	    name: {
	        value: "autocomplete",
	        domAttr: "data-name"
	    },
	    /**
	     * Wrapper selector <b>Default: ".item-form"</b>
	     */
	    wrapperSelector: {
	        value: ".item-form",
	        domAttr: "data-wrapper-selector"
	    },
	    /**
	     * Minum amount of chars to start showing suggestions <b>Default: 1</b>
	     */
	    minChars: {
	        value: 1,
	        domAttr: "data-min-chars"
	    },
	    /**
	     * Naming of query to send <b>Default: "query"</b>
	     */
	    query: {
	        value: "query",
	        domAttr: "data-query"
	    },
	    /**
	     * Defer request after input in ms <b>Default: 500</b>
	     */
	    deferRequestBy: {
	        value: 500,
	        domAttr: "data-defer"
	    },
	    /**
	     * Class to pass to autocomplete hints <b>Default: "autocomplete-hint"</b>
	     */
	    suggestionsClassName: {
	        value: "autocomplete-hint",
	        domAttr: "data-suggestions-class"
	    },
	    /**
	     * Class to pass to selected hint in list <b>Default: "autocomplete-selected"</b>
	     */
	    selectedClassName: {
	        value: "autocomplete-selected",
	        domAttr: "data-selected-class"
	    },
	    /**
	     * Callback on suggestion select
	     */
	    onSelect: {
	        domAttr: "data-on-select"
	    }
	};
	/**
	 * @override
	 * @inheritDoc
	 * @enum {Object}
	 */
	Autocomplete.prototype.optionsToProcess = {
	    /**
	     * For Autocomplete (not for Tags) this means available key->values for Autocomplete but given by PHP, not from server.
	     */
	    availableTags: {
	        processor: function processor(node) {
	            //processor
	            var JSONNode = node.getElementsByClassName("js-spiral-autocomplete-available-tags")[0];
	            if (!JSONNode || !JSONNode.innerHTML) {
	                return this.value;
	            }
	            var ret_val;
	            try {
	                ret_val = JSON.parse(JSONNode.innerHTML);
	            } catch (e) {
	                console.error("Failed to parse JSON -", JSONNode.innerHTML, e);
	                ret_val = this.value;
	            }
	            return ret_val;
	        }
	    }
	};
	/**
	 * Adds events listeners.</br>
	 */
	Autocomplete.prototype.addEventListeners = function () {
	    var that = this;
	
	    function wrap(e) {
	        if (e.type === 'keydown') that.onKeyPress(e);
	        if (e.type === 'input' || e.type === 'change') that.onInputChange(e);
	        if (e.type === 'click') that.wrap(e);
	    }
	
	    function listen(e) {
	        if (that.options.availableTags) that.onFocus(e);
	        that.els.input.addEventListener("keydown", wrap);
	        that.els.input.addEventListener("change", wrap);
	        that.els.input.addEventListener("input", wrap);
	        that.els.input.addEventListener("blur", function () {
	            that.els.input.removeEventListener("keydown", wrap);
	            that.els.input.removeEventListener("change", wrap);
	            that.els.input.removeEventListener("input", wrap);
	            that.els.input.removeEventListener("blur", listen);
	        }, false);
	    }
	
	    this.els.input.addEventListener("focus", listen);
	
	    this.els.addon.addEventListener("click", function () {
	        switch (that.state) {
	            case "search":
	                that.onValueChange();
	                break;
	            case "filled":
	                that.clear();
	                break;
	            case "add":
	                that.addTag(false, that.els.input.value);
	                break;
	            case "select":
	
	                break;
	            default:
	                break;
	        }
	    });
	};
	
	/**
	 * Key codes.
	 * @enum {Number}
	 */
	Autocomplete.prototype.keys = {
	    ESC: 27, TAB: 9, RETURN: 13, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, BACKSPACE: 8
	};
	
	/**
	 * Gets key from data-key from element.
	 * @param {Number} index Index of current suggestion.
	 * @return {String} Key that written in "data-key" attribute
	 */
	Autocomplete.prototype.getKeyByIndex = function (index) {
	    return this.els.hints.children[index].dataset.key;
	};
	
	/**
	 * Hides hints. Changes state.
	 */
	Autocomplete.prototype.hide = function () {
	    if (!this.els.hints) return;
	    this.els.group.removeChild(this.els.hints);
	    this.els.hints = null;
	    this.visible = false;
	    this.selectedIndex = -1;
	    if (this.value !== "" && this.value !== this.els.input.value) {
	        this.setState(this.options.allowNew ? "add" : "search");
	    }
	};
	
	/**
	 * Clears input, suggestions, variables.
	 */
	Autocomplete.prototype.clear = function () {
	    this.value = "";
	    this.els.input.value = "";
	    this.els.hidden.value = "";
	    this.suggestions = {};
	    this.filled = false;
	    this.hide();
	    this.setState("search");
	};
	
	/**
	 * Trim string.
	 * @param {String} str String that will be trimmed
	 * @return {String} Trimmed string
	 */
	Autocomplete.prototype.trim = function (str) {
	    return str.trim().replace(/\s+/g, '_');
	};
	
	/**
	 * Changes item-state- class on wrapper.
	 * @param {String} state
	 */
	Autocomplete.prototype.setState = function (state) {
	    if (this.state === state) return;
	    this.els.wrapper.classList.remove("item-state-" + this.state);
	    this.els.wrapper.classList.add("item-state-" + state);
	    this.state = state;
	    if (state === "filled") {
	        this.hide();
	        this.els.input.readOnly = true;
	    } else {
	        this.els.input.readOnly = false;
	    }
	};
	
	/**
	 * Change value for visible input and for invisible inputs.
	 * @param {String | Boolean} key Key to add to hidden input and than send to server.
	 * @param {String} value Value just to show to users.
	 */
	Autocomplete.prototype.addTag = function (key, value) {
	    if (this.options.allowNew || key !== true) {
	        this.els.hidden.value = this.options.allowNew ? value : key;
	        this.value = value;
	        this.els.input.value = this.value;
	        this.suggestions = {};
	        this.filled = true;
	        this.setState("filled");
	    }
	};
	
	/**
	 * Process key up.
	 * @param e Event that fires on key up.
	 */
	Autocomplete.prototype.onInputChange = function (e) {
	    var that = this;
	    if (this.disabled) return;
	
	    //    switch (e.which) {
	    //        case this.keys.UP:
	    //        case this.keys.DOWN:
	    //            return;
	    //    }
	
	    clearTimeout(this.onChangeTimeout);
	
	    if (this.value !== this.els.input.value) {
	        this.findBestHint();
	        if (this.options.deferRequestBy > 0) {
	            if (this.options.allowNew) this.setState("add");
	            // Defer lookup in case when value changes very quickly:
	            this.onChangeTimeout = setTimeout(function () {
	                that.onValueChange();
	            }, this.options.deferRequestBy);
	        } else {
	            this.onValueChange();
	        }
	    }
	};
	
	/**
	 * Finding best input.
	 * Not implemented.
	 * Maybe not need.
	 */
	Autocomplete.prototype.findBestHint = function () {};
	
	/**
	 * Process changing input's value.
	 */
	Autocomplete.prototype.onValueChange = function (q) {
	    this.value = this.els.input.value;
	    if (this.options.availableTags && !this.options.url) {
	        this.getSuggestions(this.value);
	    } else {
	        clearTimeout(this.onChangeTimeout);
	        this.selectedIndex = -1;
	        this.value.length < this.options.minChars ? this.hide() : this.getSuggestions(this.value);
	    }
	};
	
	Autocomplete.prototype.getAvailableSuggestions = function (q) {
	    if (q.trim() != "") {
	        var suggestions = {};
	        for (var key in this.options.availableTags) {
	            if (this.options.availableTags.hasOwnProperty(key) && this.options.availableTags[key].toLowerCase().indexOf(q.toLowerCase()) != -1) {
	                suggestions[key] = this.options.availableTags[key];
	            }
	        }
	        this.suggest(suggestions);
	    } else {
	        this.suggest(this.options.availableTags);
	    }
	};
	
	Autocomplete.prototype.getServerSuggestions = function (q) {
	    var that = this;
	    if (q.trim() != "") {
	        if (this.ajax != null) this.ajax[1].abort();
	        var data = {};
	        data[that.options.query] = q;
	        this.ajax = _sf2.default.ajax.send({
	            url: that.options.url,
	            data: data,
	            isReturnXHRToo: true
	        });
	        this.ajax[0].then(function (answer) {
	            if (that.value && !that.filled) that.suggest(answer.suggestions);
	        }, function (error) {});
	        this.setState("loading");
	    } else {
	        this.hide();
	    }
	};
	
	/**
	 * Gets suggestions from availableTags or from server.
	 * @param {String} q Query
	 */
	Autocomplete.prototype.getSuggestions = function (q) {
	    if (this.options.disable) {
	        this.setState("add");
	        return;
	    }
	
	    if (this.options.availableTags && !this.options.url) {
	        this.getAvailableSuggestions(q);
	    } else {
	        this.getServerSuggestions(q);
	    }
	};
	
	/**
	 * Prepare suggestions or alert.
	 * @returns {string}
	 */
	Autocomplete.prototype.prepareSuggestions = function () {
	    //todo create nodes (not innerHtml)
	    var that = this,
	        value = this.value,
	        //that.getQuery(that.value),
	    html = '';
	
	    if (this.suggestions && (!Array.isArray(this.suggestions) && (0, _getOwnPropertyNames2.default)(this.suggestions).length > 0 || Array.isArray(this.suggestions) && this.suggestions.length > 0)) {
	        if (!Array.isArray(this.suggestions)) {
	            for (var key in this.suggestions) {
	                if (this.suggestions.hasOwnProperty(key)) {
	                    html += '<div class="' + that.options.suggestionsClassName + '" data-key="' + key + '">' + that.formatResult(this.suggestions[key], value) + '</div>';
	                }
	            }
	        } else {
	            this.suggestions.forEach(function (suggestion, index) {
	                html += '<div class="' + that.options.suggestionsClassName + '" data-key="' + index + '">' + that.formatResult(suggestion, value) + '</div>';
	            });
	        }
	    } else {
	        html = '<div class="alert alert-info" style="text-align: center; margin: 0;">There are no suggestions for this query.</div>';
	    }
	
	    return html;
	};
	
	/**
	 * Shows dropdown with the hints.
	 */
	Autocomplete.prototype.suggest = function (hints) {
	    var that = this;
	    this.hide();
	    this.suggestions = hints;
	    this.els.hints = document.createElement('div');
	    this.els.hints.className = 'autocomplete-hints';
	    this.els.hints.style.position = 'absolute';
	    this.els.hints.innerHTML = this.prepareSuggestions();
	    this.els.group.insertBefore(this.els.hints, this.els.input.nextSibling);
	    this.visible = true;
	
	    this.els.hints.addEventListener("click", this.onSuggestionsClick.bind(this));
	
	    this.setState(this.options.allowNew ? "add" : "select");
	};
	
	Autocomplete.prototype.onSuggestionsClick = function (e) {
	    e.preventDefault();
	    var node = e.target;
	    while (!node.dataset.key && node !== this.els.group) {
	        node = node.parentNode;
	    }
	    if (!node.dataset.key) return;
	    this.select(node.dataset.key);
	
	    // var node = e.target;
	    // var keys = [];//array, so we can have nesting
	    // while (node !== this.els.group) {
	    //     if (node.dataset.key) keys.push(node.dataset.key);
	    //     node = node.parentNode;
	    // }
	    // if (!keys[0]) return;
	    // this.select.apply(this, keys);
	};
	
	/**
	 * Escape.
	 * @param {String} value String to escape.
	 * @returns {String} Escaped string.
	 */
	Autocomplete.prototype.escapeRegExChars = function (value) {
	    return value.replace(/[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	};
	
	/**
	 * Highlight query in suggestion.
	 * @param {String} suggestion String to be formatted
	 * @param {String} value Query to highlight from suggestion string
	 * @returns {String} Highlighted result
	 */
	Autocomplete.prototype.formatResult = function (suggestion, value) {
	    var pattern = '(' + this.escapeRegExChars(value) + ')';
	    return suggestion.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
	};
	
	/**
	 * @param {String} key
	 */
	Autocomplete.prototype.select = function (key) {
	    this.addTag(key, this.suggestions[key]);
	    this.onSelect(key);
	};
	
	Autocomplete.prototype.onSelect = function () {
	    if (!this.options.onSelect) return;
	    var cb = _sf2.default.tools.resolveKeyPath(this.options.onSelect, window);
	    cb && cb.apply(this, arguments);
	};
	
	//Methods for delimiter
	//Autocomplete.prototype.getValue = function (value) {
	//    var that = this,
	//        currentValue,
	//        parts;
	//
	//    if (!this.options.delimiter) return value;
	//    currentValue = that.currentValue;
	//    parts = currentValue.split(this.options.delimiter);
	//    if (parts.length === 1) return value;
	//    return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
	//};
	
	//Autocomplete.prototype.getQuery = function (value) {
	//    if (!this.options.delimiter) return value.trim();
	//    var parts = value.split(this.options.delimiter);
	//    return parts[parts.length - 1].trim();
	//};
	
	/**
	 * Process focus on input. Only if availableTags are present.
	 */
	Autocomplete.prototype.onFocus = function () {
	    this.getSuggestions("");
	};
	
	/**
	 * Processes keyPress
	 * @param {Object} e Event that fires on key down.
	 */
	Autocomplete.prototype.onKeyPress = function (e) {
	    var that = this;
	
	    // If suggestions are hidden and user presses arrow down -> display suggestions
	    if (!this.disabled && !this.visible && e.which === this.keys.DOWN && this.value) {
	        this.onValueChange();
	        return;
	    }
	
	    switch (e.which) {
	        //        case that.keys.BACKSPACE:
	        //            that.onValueChange();
	        //            return;
	        //            break;
	        case that.keys.RETURN:
	            e.stopImmediatePropagation();
	            e.preventDefault();
	            that.onKeyEnter();
	            break;
	        case that.keys.UP:
	            if (!that.visible) return;
	            that.onKeyUp();
	            break;
	        case that.keys.DOWN:
	            if (!that.visible) return;
	            that.onKeyDown();
	            break;
	        default:
	            return;
	    }
	
	    // Cancel event if function did not return:
	    e.stopImmediatePropagation();
	    e.preventDefault();
	};
	
	Autocomplete.prototype.onKeyEnter = function () {
	    if (this.selectedIndex === -1) {
	        if (!this.options.allowNew && this.value == this.els.input.value) {
	            this.onValueChange();
	        } else {
	            this.addTag(false, this.els.input.value);
	        }
	        return;
	    }
	
	    this.select(this.getKeyByIndex(this.selectedIndex));
	};
	
	Autocomplete.prototype.onKeyUp = function () {
	    this.moveUp();
	};
	
	Autocomplete.prototype.onKeyDown = function () {
	    this.moveDown();
	};
	
	/**
	 * Move up highlight of current suggestion.
	 */
	Autocomplete.prototype.moveUp = function () {
	    var that = this;
	
	    if (this.selectedIndex === -1) return;
	
	    if (this.selectedIndex === 0) {
	        [].forEach.call(this.els.hints.children, function (child) {
	            child.classList.remove(that.options.selectedClassName);
	        });
	        that.selectedIndex = -1;
	        return;
	    }
	
	    this.adjustScroll(this.selectedIndex - 1);
	};
	
	/**
	 * Move down highlight of current suggestion.
	 */
	Autocomplete.prototype.moveDown = function () {
	    if (this.selectedIndex === this.els.hints.children.length - 1) return;
	    this.adjustScroll(this.selectedIndex + 1);
	};
	
	/**
	 * Function to adjust scrolling if many suggestions.
	 * Not implemented now. Just transit.
	 * @param {Number} index Index of current suggestion.
	 */
	Autocomplete.prototype.adjustScroll = function (index) {
	    this.highlight(index);
	
	    var item = this.els.hints.children[this.selectedIndex],
	        hintsHeight = this.els.hints.clientHeight,
	        hintTop = item.offsetTop,
	        hintHeight = item.offsetHeight;
	
	    if (hintTop < this.els.hints.scrollTop) {
	        this.els.hints.scrollTop = hintTop;
	    } else if (hintTop > this.els.hints.scrollTop + hintsHeight - hintHeight) {
	        this.els.hints.scrollTop = hintTop - hintsHeight + hintHeight;
	    }
	};
	
	/**
	 * Highlight active suggestion.
	 * @param {Number} index Index of current suggestion.
	 * @returns {null}
	 */
	Autocomplete.prototype.highlight = function (index) {
	    var that = this;
	    [].forEach.call(this.els.hints.children, function (child) {
	        child.classList.remove(that.options.selectedClassName);
	    });
	    this.els.hints.children[index].classList.add(that.options.selectedClassName);
	    this.selectedIndex = index;
	    return null;
	};
	
	Autocomplete.prototype.die = function () {
	    console.error("TODO DIE"); //TODO DIE
	};
	
	exports.default = Autocomplete;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(6);
	__webpack_require__(7);
	module.exports = function getOwnPropertyNames(it){
	  return $.getNames(it);
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(8)('getOwnPropertyNames', function(){
	  return __webpack_require__(15).get;
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(9)
	  , core    = __webpack_require__(11)
	  , fails   = __webpack_require__(14);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(10)
	  , core      = __webpack_require__(11)
	  , ctx       = __webpack_require__(12)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 10 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(13);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(16)
	  , getNames  = __webpack_require__(6).getNames
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(17)
	  , defined = __webpack_require__(19);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(18);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(21), __esModule: true };

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(22);
	module.exports = __webpack_require__(11).Object.assign;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(9);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(23)});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(6)
	  , toObject = __webpack_require__(24)
	  , IObject  = __webpack_require__(17);
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(14)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(19);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(26), __esModule: true };

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(6);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(28);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(30)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?minimize!./../node_modules/less-loader/index.js!./autocomplete.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?minimize!./../node_modules/less-loader/index.js!./autocomplete.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(29)();
	// imports
	
	
	// module
	exports.push([module.id, ".item-form{position:relative}.item-form,.item-form input[type=text]{font-size:1rem}.item-form input[type=text]:focus+.autocomplete-hints{border-color:#33a3fe;border-top-color:#b9b9b9}.item-state-search .btn-icon:before{content:'\\26B2';transform:rotate(-45deg);display:inline-block;position:relative;bottom:2px}.item-state-add .btn-icon:before{content:'+'}.item-state-filled .btn-icon:before{content:'\\D7'}.item-state-select .btn-icon:hover{opacity:.2;cursor:default}.item-state-select .btn-icon:before{content:'\\21D9'}.item-state-loading .btn-icon:before{content:'\\21BB'}.btn-icon{position:absolute;bottom:3px;right:0;width:30px;font-size:24px;line-height:24px}.autocomplete-hints{z-index:10000;top:100%;background:#fff;border:1px solid #b9b9b9;border-bottom-left-radius:2px;border-bottom-right-radius:2px;margin-top:-1px;max-width:100%;width:100%;max-height:200px;overflow-y:scroll}.autocomplete-hints>.autocomplete-hint{padding:5px 10px;cursor:pointer}.autocomplete-hints>.autocomplete-hint.autocomplete-selected,.autocomplete-hints>.autocomplete-hint:hover{background:#e5e5e5}.autocomplete-hints strong{color:#33a3fe;font-weight:400}", ""]);
	
	// exports


/***/ },
/* 29 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=sf.autocomplete.js.map