(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'underscore',
            'backbone',
            'exports'
        ], function (_, Backbone, exports) {
            factory(root, {}, Backbone, _);
        });
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        var Backbone = require('underscore');
        factory(root, exports, Backbone, _);
    } else {
        factory(root, {}, root.Backbone, root._);
    }
}(this, function(root, store, Backbone, _) {

 
 
}));