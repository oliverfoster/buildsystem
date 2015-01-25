require.config({
    "paths": {
        "backbone": "core/libraries/backbone",
        "stemo": "core/libraries/backbone.stemo",
        "waiter": "core/libraries/backbone.waiter",
        "bowser": "core/libraries/bowser",
        "buildsystem": "core/libraries/buildsystem",
        "handlebars": "core/libraries/handlebars-v2.0.0",
        "jquery": "core/libraries/jquery-2.1.1",
        "a11y": "core/libraries/jquery.a11y",
        "cookie": "core/libraries/jquery.cookie",
        "imageready": "core/libraries/jquery.imageready",
        "onscreen": "core/libraries/jquery.onscreen",
        "scrollTo": "core/libraries/jquery.scrollTo",
        "modernizr": "core/libraries/modernizr",
        "require": "core/libraries/require",
        "redefiner": "core/libraries/require.redefiner",
        "standardize": "core/libraries/standardize",
        "underscore": "core/libraries/underscore",
        "compare": "core/libraries/underscore.compare",
        "size": "core/libraries/underscore.compare.window.size",
        "velocity": "core/libraries/velocity"
    },
    "map": {}
});
require(["buildsystem","app"], function() {
buildsystem.loaded.javascript = true;
});
