"use strict";
import sf from 'sf';//resolved by webpack's "externals"

var Autocomplete = function (sf, node, options) {
    this._construct(sf, node, options);
};
Autocomplete.prototype = Object.create(sf.core.BaseDOMConstructor.prototype);
Autocomplete.prototype.name = "autocomplete";
Autocomplete.prototype._construct = function (sf, node, options) {
    this.init(sf, node, options);//call parent

    var defaults = {
        /*NOT REQUIRED OPTIONS*/
        /*delimiter: "",*/
    };
    var that = this;
    this.options = Object.assign(this.options, defaults);
    if (options) {//if we pass options extend all options by passed options
        this.options = Object.assign(this.options, options);
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


    this.retrieveValueByKey();

    if (this.key && this.value) {
        this.setState("filled");
    } else {
        this.setState("search");
    }

    if (this.options.availableTags && !this.options.url) {
        this.options.deferRequestBy = 0;
    }

    this.addEventListeners();

    this.events = new sf.modules.core.Events(["select", "clear"]);
};

Autocomplete.prototype._key = "";

/**
 * @override
 * @inheritDoc
 * @enum {string}
 */
Autocomplete.prototype.optionsToGrab =
{
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
     *  Pass key if possible when values that not present in suggestions are allowed, i.e. with allowNew-param<b>Default: "false"</b>
     */
    keyOnNewAllowed: {
        value: false,
        domAttr: "data-key-on-new"
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
        processor: function (node) { //processor
            var JSONNode = node.getElementsByClassName("js-spiral-autocomplete-available-tags")[0];
            if (!JSONNode || !(JSONNode.innerHTML)) {
                return this.value
            }
            var ret_val;
            try {
                ret_val = JSON.parse(JSONNode.innerHTML);
            } catch (e) {
                console.error("Failed to parse JSON -", JSONNode.innerHTML, e);
                ret_val = this.value
            }
            return ret_val;
        }
    }
};

Autocomplete.prototype.retrieveValueByKey = function () {
    var that = this;
    if (!this.value && this.els.hidden.value) {
        sf.ajax.send({
            url: this.options.url,
            data: {id: this.els.hidden.value}
        }).then(function (success) {
            if(success.suggestions){
                that.els.input.value =  success.suggestions[that.els.hidden.value];
                that.filled = true;
                that.setState("filled");
            } else {
                that.els.hidden.value = ""
            }
        }, function (error) {
            that.els.hidden.value = ""
        });
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
    this.events.trigger("clear", this);
};

/**
 * Trim string.
 * @param {String} str String that will be trimmed
 * @return {String} Trimmed string
 */
Autocomplete.prototype.trim = function (str) {
    return str.trim().replace(/\s+/g, '_')
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
        this.els.input.classList.add('read-only');
    } else {
        this.els.input.readOnly = false;
        this.els.input.classList.remove('read-only');
    }
};

/**
 * Change value for visible input and for invisible inputs.
 * @param {String | Boolean} key Key to add to hidden input and than send to server.
 * @param {String} value Value just to show to users.
 */
Autocomplete.prototype.addTag = function (key, value) {
    if (this.options.allowNew || key !== true) {

        if (this.options.allowNew && this.options.keyOnNewAllowed && key) {
            this.els.hidden.value = key;
        } else {
            this.els.hidden.value = this.options.allowNew ? value : key;
        }

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
            if (this.options.allowNew)
                this.setState("add");
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
Autocomplete.prototype.findBestHint = function () {

};

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
            if (this.options.availableTags.hasOwnProperty(key) &&
                this.options.availableTags[key].toLowerCase().indexOf(q.toLowerCase()) != -1) {
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
        this.ajax = sf.ajax.send({
            url: that.options.url,
            data: data,
            isReturnXHRToo: true
        });
        this.ajax[0].then(
            function (answer) {
                if (that.value && !that.filled) that.suggest(answer.suggestions);
            },
            function (error) {

            });
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
Autocomplete.prototype.prepareSuggestions = function () {//todo create nodes (not innerHtml)
    var that = this,
        value = this.value,//that.getQuery(that.value),
        html = '';

    if (this.suggestions && ((!Array.isArray(this.suggestions) && Object.getOwnPropertyNames(this.suggestions).length > 0) || (Array.isArray(this.suggestions) && this.suggestions.length > 0))) {
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
    this.events.trigger("select", this);
    if (!this.options.onSelect) return;
    var cb = sf.tools.resolveKeyPath(this.options.onSelect, window);
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
    if (this.selectedIndex === (this.els.hints.children.length - 1)) return;
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
    console.error("TODO DIE");//TODO DIE
};

export {Autocomplete as default};