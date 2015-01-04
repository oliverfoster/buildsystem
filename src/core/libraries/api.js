(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
           'exports'
        ], function (exports) {
            return root.api = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        exports = factory(root, exports);
    } else {
        root.api = factory(root, {});
    }
}(this, function(root) {
	//Initial Public Interface

    var pub = {
        data: function(json) {
            core.loaded.data++;
            core.data.buffer.push(json);
        }
    };

    return pub;
}));