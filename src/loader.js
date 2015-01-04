require.config({
    "paths": {
        "core": "core/libraries/core",
        "bowser": "core/libraries/bowser",
        "require": "core/libraries/require",
        "redefiner": "core/libraries/redefiner",
        "json2": "core/libraries/json2",
        "modernizr": "core/libraries/modernizr",
        "jquery": "core/libraries/jquery-2.1.1",
        "a11y": "core/libraries/jquery.a11y",
        "handlebars": "core/libraries/handlebars-v2.0.0",
        "underscore": "core/libraries/underscore",
        "backbone": "core/libraries/backbone",
        "stemo": "core/libraries/stemo",
        "standardize": "core/libraries/standardize",
        "velocity": "core/libraries/velocity",
        "imageReady": "core/libraries/imageReady",
        "onscreen": "core/libraries/onscreen",
        "scrollTo": "core/libraries/scrollTo",
        "compare": "core/libraries/compare",
        "api": "core/libraries/api"
    },
    "map": {}
});
require(["core","app"], function() {
	core.loaded.javascript = true;
});
