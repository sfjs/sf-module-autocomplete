# sf-autocomplete

Module is [Front End Specifications 1.0.RC1 Compliant](https://red.spiralscout.com/projects/spiral-cms/wiki/Wiki)

Autocomplete module

## Usage Example
```html
    <div class="item-form">
        <input type="text" data-name="test" data-url="response.php" class="js-sf-autocomplete"/>
    </div>
```

## Options
* **data-url** - URL to get suggestions form *Default: "/"*
* **data-allow-new** - Accept or not values that not present in suggestions *Default: "false"*
* **data-name** - Name to send *Default: "autocomplete"*
* **data-wrapper-selector** - Wrapper selector *Default: ".item-form"*
* **data-min-chars** - Minum amount of chars to start showing suggestions *Default: 1*
* **data-query** - Naming of query to send *Default: "query"*
* **data-defer** - Defer request after input in ms *Default: 500*
* **data-suggestions-class** - Class to pass to autocomplete hints *Default: "autocomplete-hint"*
* **data-selected-class** - Class to pass to selected hint in list *Default: "autocomplete-selected"*
* **data-value** - Predefined value of input to send *Default: ""*
* **data-on-select** - Callback on suggestion select

## Dependencies

[sf-core](https://github.com/sfjs/sf.js) - Core front end library

## Local Development

### Installation

    npm install 

### Building

    npm run build


## License

Copyright (c) 2016 Yauheni Yasinau, Maxim Matveev and contributors. Released under an [MIT license](https://github.com/sfjs/sf-module-autocomplete/blob/master/LICENSE).
