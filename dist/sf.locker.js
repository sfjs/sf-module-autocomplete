!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("sf-core")):"function"==typeof define&&define.amd?define("sf-autocomplete",["sf-core"],e):"object"==typeof exports?exports["sf-autocomplete"]=e(require("sf-core")):t["sf-autocomplete"]=e(t.sf)}(this,function(t){return function(t){function e(n){if(s[n])return s[n].exports;var i=s[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var s={};return e.m=t,e.c=s,e.i=function(t){return t},e.d=function(t,s,n){e.o(t,s)||Object.defineProperty(t,s,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var s=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(s,"a",s),s},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=7)}([function(e,s){e.exports=t},function(t,e,s){"use strict";var n=s(0),i=s(2).default;s(6),n.instancesController.registerInstanceType(i,"js-sf-autocomplete"),t.exports=i},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s(0),i=function(t){return t&&t.__esModule?t:{default:t}}(n),o=function(t,e,s){this._construct(t,e,s)};o.prototype=Object.create(i.default.core.BaseDOMConstructor.prototype),o.prototype.name="autocomplete",o.prototype._construct=function(t,e,s){this.init(t,e,s);var n={};this.options=Object.assign(this.options,n),s&&(this.options=Object.assign(this.options,s)),this.filled=!1,this.selectedIndex=-1,this.els={node:e,input:e,wrapper:t.helpers.domTools.closest(e,this.options.wrapperSelector),group:e.parentNode,hidden:document.createElement("input"),hints:null,addon:document.createElement("button")},this.els.input.autocomplete="off",this.els.wrapper.appendChild(this.els.hidden),this.els.hidden.setAttribute("type","hidden"),this.els.hidden.name=this.els.input.dataset.name,this.els.input.dataset.value&&(this.els.hidden.value=this.els.input.dataset.value),this.els.addon.className="btn-icon",this.els.addon.setAttribute("type","button"),this.els.addon.style.top=this.els.input.offsetTop+Math.round(this.els.input.offsetHeight/2)+"px",this.els.group.appendChild(this.els.addon),"/"===this.options.url[this.options.url.length-1]&&(this.options.url=this.options.url.substring(0,this.options.url.length-1)),this.value=this.els.input.value,this.key=this.els.input.dataset.key,this.retrieveValueByKey(),this.key&&this.value?this.setState("filled"):this.setState("search"),this.options.availableTags&&!this.options.url&&(this.options.deferRequestBy=0),this.addEventListeners(),this.events=new t.modules.core.Events(["select","clear"])},o.prototype._key="",o.prototype.optionsToGrab={url:{value:"/",domAttr:"data-url"},allowNew:{value:!1,domAttr:"data-allow-new"},keyOnNewAllowed:{value:!1,domAttr:"data-key-on-new"},name:{value:"autocomplete",domAttr:"data-name"},wrapperSelector:{value:".item-form",domAttr:"data-wrapper-selector"},minChars:{value:1,domAttr:"data-min-chars"},query:{value:"query",domAttr:"data-query"},deferRequestBy:{value:500,domAttr:"data-defer"},suggestionsClassName:{value:"autocomplete-hint",domAttr:"data-suggestions-class"},selectedClassName:{value:"autocomplete-selected",domAttr:"data-selected-class"},onSelect:{domAttr:"data-on-select"}},o.prototype.optionsToProcess={availableTags:{processor:function(t){var e=t.getElementsByClassName("js-spiral-autocomplete-available-tags")[0];if(!e||!e.innerHTML)return this.value;var s;try{s=JSON.parse(e.innerHTML)}catch(t){console.error("Failed to parse JSON -",e.innerHTML,t),s=this.value}return s}}},o.prototype.retrieveValueByKey=function(){var t=this;!this.value&&this.els.hidden.value&&i.default.ajax.send({url:this.options.url,data:{id:this.els.hidden.value}}).then(function(e){e.suggestions?(t.els.input.value=e.suggestions[t.els.hidden.value],t.filled=!0,t.setState("filled")):t.els.hidden.value=""},function(e){t.els.hidden.value=""})},o.prototype.addEventListeners=function(){function t(t){"keydown"===t.type&&s.onKeyPress(t),"input"!==t.type&&"change"!==t.type||s.onInputChange(t),"click"===t.type&&s.wrap(t)}function e(n){s.options.availableTags&&s.onFocus(n),s.els.input.addEventListener("keydown",t),s.els.input.addEventListener("change",t),s.els.input.addEventListener("input",t),s.els.input.addEventListener("blur",function(){s.els.input.removeEventListener("keydown",t),s.els.input.removeEventListener("change",t),s.els.input.removeEventListener("input",t),s.els.input.removeEventListener("blur",e)},!1)}var s=this;this.els.input.addEventListener("focus",e),this.els.addon.addEventListener("click",function(){switch(s.state){case"search":s.onValueChange();break;case"filled":s.clear();break;case"add":s.addTag(!1,s.els.input.value)}})},o.prototype.keys={ESC:27,TAB:9,RETURN:13,LEFT:37,UP:38,RIGHT:39,DOWN:40,BACKSPACE:8},o.prototype.getKeyByIndex=function(t){return this.els.hints.children[t].dataset.key},o.prototype.hide=function(){this.els.hints&&(this.els.group.removeChild(this.els.hints),this.els.hints=null,this.visible=!1,this.selectedIndex=-1,""!==this.value&&this.value!==this.els.input.value&&this.setState(this.options.allowNew?"add":"search"))},o.prototype.clear=function(){this.value="",this.els.input.value="",this.els.hidden.value="",this.suggestions={},this.filled=!1,this.hide(),this.setState("search"),this.events.trigger("clear",this)},o.prototype.trim=function(t){return t.trim().replace(/\s+/g,"_")},o.prototype.setState=function(t){this.state!==t&&(this.els.wrapper.classList.remove("item-state-"+this.state),this.els.wrapper.classList.add("item-state-"+t),this.state=t,"filled"===t?(this.hide(),this.els.input.readOnly=!0,this.els.input.classList.add("read-only")):(this.els.input.readOnly=!1,this.els.input.classList.remove("read-only")))},o.prototype.addTag=function(t,e){(this.options.allowNew||t!==!0)&&(this.options.allowNew&&this.options.keyOnNewAllowed&&t?this.els.hidden.value=t:this.els.hidden.value=this.options.allowNew?e:t,this.value=e,this.els.input.value=this.value,this.suggestions={},this.filled=!0,this.setState("filled"))},o.prototype.onInputChange=function(t){var e=this;this.disabled||(clearTimeout(this.onChangeTimeout),this.value!==this.els.input.value&&(this.findBestHint(),this.options.deferRequestBy>0?(this.options.allowNew&&this.setState("add"),this.onChangeTimeout=setTimeout(function(){e.onValueChange()},this.options.deferRequestBy)):this.onValueChange()))},o.prototype.findBestHint=function(){},o.prototype.onValueChange=function(t){this.value=this.els.input.value,this.options.availableTags&&!this.options.url?this.getSuggestions(this.value):(clearTimeout(this.onChangeTimeout),this.selectedIndex=-1,this.value.length<this.options.minChars?this.hide():this.getSuggestions(this.value))},o.prototype.getAvailableSuggestions=function(t){if(""!=t.trim()){var e={};for(var s in this.options.availableTags)this.options.availableTags.hasOwnProperty(s)&&this.options.availableTags[s].toLowerCase().indexOf(t.toLowerCase())!=-1&&(e[s]=this.options.availableTags[s]);this.suggest(e)}else this.suggest(this.options.availableTags)},o.prototype.getServerSuggestions=function(t){var e=this;if(""!=t.trim()){null!=this.ajax&&this.ajax[1].abort();var s={};s[e.options.query]=t,this.ajax=i.default.ajax.send({url:e.options.url,data:s,isReturnXHRToo:!0}),this.ajax[0].then(function(t){e.value&&!e.filled&&e.suggest(t.suggestions)},function(t){}),this.setState("loading")}else this.hide()},o.prototype.getSuggestions=function(t){if(this.options.disable)return void this.setState("add");this.options.availableTags&&!this.options.url?this.getAvailableSuggestions(t):this.getServerSuggestions(t)},o.prototype.prepareSuggestions=function(){var t=this,e=this.value,s="";if(this.suggestions&&(!Array.isArray(this.suggestions)&&Object.getOwnPropertyNames(this.suggestions).length>0||Array.isArray(this.suggestions)&&this.suggestions.length>0))if(Array.isArray(this.suggestions))this.suggestions.forEach(function(n,i){s+='<div class="'+t.options.suggestionsClassName+'" data-key="'+i+'">'+t.formatResult(n,e)+"</div>"});else for(var n in this.suggestions)this.suggestions.hasOwnProperty(n)&&(s+='<div class="'+t.options.suggestionsClassName+'" data-key="'+n+'">'+t.formatResult(this.suggestions[n],e)+"</div>");else s='<div class="alert alert-info" style="text-align: center; margin: 0;">There are no suggestions for this query.</div>';return s},o.prototype.suggest=function(t){this.hide(),this.suggestions=t,this.els.hints=document.createElement("div"),this.els.hints.className="autocomplete-hints",this.els.hints.style.position="absolute",this.els.hints.innerHTML=this.prepareSuggestions(),this.els.group.insertBefore(this.els.hints,this.els.input.nextSibling),this.visible=!0,this.els.hints.addEventListener("click",this.onSuggestionsClick.bind(this)),this.setState(this.options.allowNew?"add":"select")},o.prototype.onSuggestionsClick=function(t){t.preventDefault();for(var e=t.target;!e.dataset.key&&e!==this.els.group;)e=e.parentNode;e.dataset.key&&this.select(e.dataset.key)},o.prototype.escapeRegExChars=function(t){return t.replace(/[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},o.prototype.formatResult=function(t,e){var s="("+this.escapeRegExChars(e)+")";return t.replace(new RegExp(s,"gi"),"<strong>$1</strong>")},o.prototype.select=function(t){this.addTag(t,this.suggestions[t]),this.onSelect(t)},o.prototype.onSelect=function(){if(this.events.trigger("select",this),this.options.onSelect){var t=i.default.tools.resolveKeyPath(this.options.onSelect,window);t&&t.apply(this,arguments)}},o.prototype.onFocus=function(){this.getSuggestions("")},o.prototype.onKeyPress=function(t){var e=this;if(!this.disabled&&!this.visible&&t.which===this.keys.DOWN&&this.value)return void this.onValueChange();switch(t.which){case e.keys.RETURN:t.stopImmediatePropagation(),t.preventDefault(),e.onKeyEnter();break;case e.keys.UP:if(!e.visible)return;e.onKeyUp();break;case e.keys.DOWN:if(!e.visible)return;e.onKeyDown();break;default:return}t.stopImmediatePropagation(),t.preventDefault()},o.prototype.onKeyEnter=function(){if(this.selectedIndex===-1)return void(this.options.allowNew||this.value!=this.els.input.value?this.addTag(!1,this.els.input.value):this.onValueChange());this.select(this.getKeyByIndex(this.selectedIndex))},o.prototype.onKeyUp=function(){this.moveUp()},o.prototype.onKeyDown=function(){this.moveDown()},o.prototype.moveUp=function(){var t=this;if(this.selectedIndex!==-1)return 0===this.selectedIndex?([].forEach.call(this.els.hints.children,function(e){e.classList.remove(t.options.selectedClassName)}),void(t.selectedIndex=-1)):void this.adjustScroll(this.selectedIndex-1)},o.prototype.moveDown=function(){this.selectedIndex!==this.els.hints.children.length-1&&this.adjustScroll(this.selectedIndex+1)},o.prototype.adjustScroll=function(t){this.highlight(t);var e=this.els.hints.children[this.selectedIndex],s=this.els.hints.clientHeight,n=e.offsetTop,i=e.offsetHeight;n<this.els.hints.scrollTop?this.els.hints.scrollTop=n:n>this.els.hints.scrollTop+s-i&&(this.els.hints.scrollTop=n-s+i)},o.prototype.highlight=function(t){var e=this;return[].forEach.call(this.els.hints.children,function(t){t.classList.remove(e.options.selectedClassName)}),this.els.hints.children[t].classList.add(e.options.selectedClassName),this.selectedIndex=t,null},o.prototype.die=function(){console.error("TODO DIE")},e.default=o},function(t,e,s){e=t.exports=s(4)(),e.push([t.i,'.item-form{position:relative}.item-form,.item-form input[type=text]{font-size:1rem}.item-form input[type=text].js-sf-autocomplete::-ms-clear{display:none}.item-form input[type=text]:focus+.autocomplete-hints{border-color:#33a3fe;border-top-color:#b9b9b9}.item-state-search .btn-icon:before{content:"\\26B2";transform:rotate(-45deg);display:inline-block;position:relative}.item-state-add .btn-icon:before{content:"+"}.item-state-filled .btn-icon:before{content:"\\D7"}.item-state-select .btn-icon:hover{opacity:.2;cursor:default}.item-state-select .btn-icon:before{content:"\\21D9"}.item-state-loading .btn-icon:before{content:"\\21BB"}.btn-icon{position:absolute;transform:translateY(-50%);-webkit-transform:translateY(-50%);right:0;width:30px;font-size:24px;line-height:24px}.btn-icon:focus{background-color:transparent}.autocomplete-hints{z-index:10000;background:#fff;border:1px solid #b9b9b9;border-bottom-left-radius:2px;border-bottom-right-radius:2px;margin-top:-1px;max-width:100%;width:100%;max-height:200px;overflow-y:scroll;color:#b9b9b9}.autocomplete-hints>.autocomplete-hint{padding:5px 10px;cursor:pointer}.autocomplete-hints>.autocomplete-hint.autocomplete-selected,.autocomplete-hints>.autocomplete-hint:hover{background:#e5e5e5}.autocomplete-hints strong{color:#33a3fe;font-weight:400}',"",{version:3,sources:["O:/Projects/SF/sf-module-autocomplete/src/O:/Projects/SF/sf-module-autocomplete/src/autocomplete.less"],names:[],mappings:"AAEA,WACE,iBACA,CAFF,uCAEE,cAAA,CAMI,0DACE,YAAA,CAIJ,sDAEI,qBACA,wBAAA,CAMR,oCACE,gBACA,yBACA,qBACA,iBAAA,CAIF,iCACE,WAAS,CAGX,oCACE,aAAS,CAIT,mCACE,WACA,cAAA,CAEF,oCACE,eAAS,CAIb,qCACE,eAAS,CAGX,UACE,kBAEA,2BACA,mCACA,QACA,WACA,eACA,gBAAA,CACA,gBACE,4BAAA,CAIJ,oBACE,cAEA,gBACA,yBACA,8BACA,+BACA,gBACA,eACA,WACA,iBACA,kBACA,aAAA,CAZF,uCAeI,iBACA,cAAA,CACA,AAGA,0GACE,kBAAA,CArBN,2BAyBI,cACA,eAAA,CAAA",file:"autocomplete.less",sourcesContent:["@import (reference) \"variables\";\n\n.item-form {\n  position: relative;\n  font-size: 1rem;\n\n  input[type='text'] {\n    font-size: 1rem;\n\n    &.js-sf-autocomplete {\n      &::-ms-clear {\n        display: none;\n      }\n    }\n\n    &:focus {\n      + .autocomplete-hints {\n        border-color: @spiral-blue;\n        border-top-color: @spiral-grey;\n      }\n    }\n  }\n}\n\n.item-state-search .btn-icon:before {\n  content: '⚲';\n  transform: rotateZ(-45deg);\n  display: inline-block;\n  position: relative;\n  // bottom: 2px;\n}\n\n.item-state-add .btn-icon:before {\n  content: '+';\n}\n\n.item-state-filled .btn-icon:before {\n  content: '×';\n}\n\n.item-state-select .btn-icon {\n  &:hover {\n    opacity: 0.2;\n    cursor: default;\n  }\n  &:before {\n    content: '⇙';\n  }\n}\n\n.item-state-loading .btn-icon:before {\n  content: '\\21BB';\n}\n\n.btn-icon {\n  position: absolute;\n  // bottom: 3px;\n  transform: translateY(-50%);\n  -webkit-transform: translateY(-50%);\n  right: 0;\n  width: 30px;\n  font-size: 24px;\n  line-height: 24px;\n  &:focus {\n    background-color: transparent;\n  }\n}\n\n.autocomplete-hints {\n  z-index: 10000;\n  // top: 100%;\n  background: @spiral-white;\n  border: 1px solid @spiral-grey;\n  border-bottom-left-radius: 2px;\n  border-bottom-right-radius: 2px;\n  margin-top: -1px;\n  max-width: 100%;\n  width: 100%;\n  max-height: 200px;\n  overflow-y: scroll;\n  color: @spiral-grey;\n\n  > .autocomplete-hint {\n    padding: 5px 10px;\n    cursor: pointer;\n    &:hover {\n      background: @spiral-light-grey;\n    }\n    &.autocomplete-selected {\n      background: @spiral-light-grey;\n    }\n  }\n  strong {\n    color: @spiral-blue;\n    font-weight: normal;\n  }\n}\n"],sourceRoot:""}])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var s=this[e];s[2]?t.push("@media "+s[2]+"{"+s[1]+"}"):t.push(s[1])}return t.join("")},t.i=function(e,s){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},i=0;i<this.length;i++){var o=this[i][0];"number"==typeof o&&(n[o]=!0)}for(i=0;i<e.length;i++){var r=e[i];"number"==typeof r[0]&&n[r[0]]||(s&&!r[2]?r[2]=s:s&&(r[2]="("+r[2]+") and ("+s+")"),t.push(r))}},t}},function(t,e){function s(t,e){for(var s=0;s<t.length;s++){var n=t[s],i=c[n.id];if(i){i.refs++;for(var o=0;o<i.parts.length;o++)i.parts[o](n.parts[o]);for(;o<n.parts.length;o++)i.parts.push(l(n.parts[o],e))}else{for(var r=[],o=0;o<n.parts.length;o++)r.push(l(n.parts[o],e));c[n.id]={id:n.id,refs:1,parts:r}}}}function n(t){for(var e=[],s={},n=0;n<t.length;n++){var i=t[n],o=i[0],r=i[1],a=i[2],l=i[3],u={css:r,media:a,sourceMap:l};s[o]?s[o].parts.push(u):e.push(s[o]={id:o,parts:[u]})}return e}function i(t,e){var s=g(),n=A[A.length-1];if("top"===t.insertAt)n?n.nextSibling?s.insertBefore(e,n.nextSibling):s.appendChild(e):s.insertBefore(e,s.firstChild),A.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");s.appendChild(e)}}function o(t){t.parentNode.removeChild(t);var e=A.indexOf(t);e>=0&&A.splice(e,1)}function r(t){var e=document.createElement("style");return e.type="text/css",i(t,e),e}function a(t){var e=document.createElement("link");return e.rel="stylesheet",i(t,e),e}function l(t,e){var s,n,i;if(e.singleton){var l=m++;s=v||(v=r(e)),n=u.bind(null,s,l,!1),i=u.bind(null,s,l,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(s=a(e),n=p.bind(null,s),i=function(){o(s),s.href&&URL.revokeObjectURL(s.href)}):(s=r(e),n=h.bind(null,s),i=function(){o(s)});return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e)}else i()}}function u(t,e,s,n){var i=s?"":n.css;if(t.styleSheet)t.styleSheet.cssText=y(e,i);else{var o=document.createTextNode(i),r=t.childNodes;r[e]&&t.removeChild(r[e]),r.length?t.insertBefore(o,r[e]):t.appendChild(o)}}function h(t,e){var s=e.css,n=e.media;if(n&&t.setAttribute("media",n),t.styleSheet)t.styleSheet.cssText=s;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(s))}}function p(t,e){var s=e.css,n=e.sourceMap;n&&(s+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */");var i=new Blob([s],{type:"text/css"}),o=t.href;t.href=URL.createObjectURL(i),o&&URL.revokeObjectURL(o)}var c={},d=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}},f=d(function(){return/msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase())}),g=d(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,m=0,A=[];t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},void 0===e.singleton&&(e.singleton=f()),void 0===e.insertAt&&(e.insertAt="bottom");var i=n(t);return s(i,e),function(t){for(var o=[],r=0;r<i.length;r++){var a=i[r],l=c[a.id];l.refs--,o.push(l)}t&&s(n(t),e);for(var r=0;r<o.length;r++){var l=o[r];if(0===l.refs){for(var u=0;u<l.parts.length;u++)l.parts[u]();delete c[l.id]}}}};var y=function(){var t=[];return function(e,s){return t[e]=s,t.filter(Boolean).join("\n")}}()},function(t,e,s){var n=s(3);"string"==typeof n&&(n=[[t.i,n,""]]),s(5)(n,{}),n.locals&&(t.exports=n.locals)},function(t,e,s){t.exports=s(1)}])});
//# sourceMappingURL=sf.locker.js.map