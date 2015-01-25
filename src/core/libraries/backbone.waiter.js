(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
           'backbone'
        ], function (backbone) {
            return backbone.Waiter = factory(backbone);
        });
    }
}(this, function(Backbone) {
	
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
        if (typeof this._callback === "function") this._callback();
    };

    



    waiter.Task = function(callback, that, options) {
        that = that || this;

        _.bindAll(this, 'ready');

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

        setupFunctions.call(this);
        concatinateAnyArguments.call(this, arguments);

        //force subject of these functions to be the current instance always
        function setupFunctions() {
            _.bindAll(this, 'isReady', 'sync', 'async', 'add', 'finished', 'check')
        }

        function concatinateAnyArguments(args) {
            if (args.length > 0 ){
                for (var i = 0, l = args.length; i < l; i++) {
                    if (args[i] instanceof Array || args[i].length !== undefined) this.concat(args[i]);
                    else this.push(args[i]);
                }
                
                this.finished();
            }
        }

        if (typeof callback === "function") this.listenTo(this, "ready", _.bind(callback, that));
    };

    waiter.Queue.prototype = _.extend([], Backbone.Events);

    waiter.Queue.prototype.isReady = function() {
        var notReady = _.where(this, { _isReady:false } );
        return notReady.length === 0;
    };

    waiter.Queue.prototype.sync = function(callback, that) {
        this.add( new waiter.Task(callback, that, {sync:true}) );
        return this;
    };

    waiter.Queue.prototype.async = function(callback, that) {
        this.add( new waiter.Task(callback, that, {sync:false}) );
        return this;
    };

    waiter.Queue.prototype.add = function(task) {
        this.push(task);
        
        this.finished();

        return this;
    };

    waiter.Queue.prototype.finished = function() {

        for (var i = 0, l = this.length; i < l; i++) {
            this.stopListening(this[i]);
            this.listenTo(this[i], "ready", this.check);
        }

        return this;
    };
    
    waiter.Queue.prototype.check = function() {
        if (this.isReady()) {
            this.trigger("ready");
            this.destroy();
        }
        return this;
    };

    waiter.Queue.prototype.destroy = function () {
        this.stopListening();
        this.length = 0;
    };

    return waiter;
}));