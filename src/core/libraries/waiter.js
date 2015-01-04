(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
           'exports',
           'backbone'
        ], function (exports, backbone) {
            return root.Waiter = factory(root, exports, backbone);
        });
    } else if (typeof exports !== 'undefined') {
        exports = factory(root, exports, Backbone);
    } else {
        root.Waiter = factory(root, {}, Backbone);
    }
}(this, function(root, exports, Backbone) {
	
    //Initial Public Interface
    var waiter = {};

    waiter.Trigger = function(callback, that) {
        this._this = that || this;

        this._callback = callback;
        this.trigger = _.bind(this.trigger, this);

    };

    _.extend(waiter.Trigger.prototype, Backbone.Events);

    waiter.Trigger.prototype._this = null;

    waiter.Trigger.prototype._callback = null;

    waiter.Trigger.prototype.trigger = function() {
        if (typeof callback === "function") this._callback();
    };

    



    waiter.Task = function(callback, that, options) {
        that = that || this;

        this.ready = _.bind(this.ready, this);

        if (typeof callback === "function") {
            if (options && options.sync) _.bind(callback, that)(this);
            else _.defer(_.bind(callback, that, this));
        } 

    };

    _.extend(waiter.Task.prototype, Backbone.Events);

    waiter.Task.prototype._isReady = false;

    waiter.Task.prototype.ready = function() {
        this._isReady = true;
        this.trigger("ready");
        return this;
    };



    waiter.Queue = function(callback, that) {
        that = that || this;

        _.extend(this, Backbone.Events);

        //force subject of these functions to be the current instance always
        this.isReady = _.bind(this.isReady, this);
        this.sync = _.bind(this.sync, this);
        this.async = _.bind(this.async, this);
        this.add = _.bind(this.add, this);
        this.finished = _.bind(this.finished, this);
        this.check = _.bind(this.check, this);


        if (arguments.length > 0 ){
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] instanceof Array || arguments[i].length !== undefined) this.concat(arguments[i]);
                else this.push(arguments[i]);
            }
            
            this.finished();
        }

        if (typeof callback === "function") this.on("ready", _.bind(callback, that, this));
    };

    waiter.Queue.prototype = [];

    waiter.Queue.prototype.isReady = function() {
        var notReady = _.where(this, { _isReady:false } );
        return notReady.length === 0;
    };

    waiter.Queue.prototype.sync = function(callback, that) {
        this.add( new waiter.Task(callback, that, {sync:true}) );
        return this;
    };

    waiter.Queue.prototype.async = function(callback, that) {
        this.add( new waiter.Task(callback, that) );
        return this;
    };

    waiter.Queue.prototype.add = function(task) {
        this.push(task);
        
        this.finished();

        return this;
    };

    waiter.Queue.prototype.finished = function() {

        for (var i = 0; i < this.length; i++) {
            this.stopListening(this[i]);
            this.listenTo(this[i], "ready", this.check);
        }

        return this;
    };
    
    waiter.Queue.prototype.check = function() {
        if (this.isReady()) this.trigger("ready");
        return this;
    };

    return waiter;
}));