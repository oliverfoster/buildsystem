(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'underscore',
            'backbone',
            'jquery',
            'exports'
        ], function (_, Backbone, $, exports) {
            return root.Stemo = factory(root, exports, Backbone, _, $);
        });
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        var Backbone = require('underscore');
        var $ = require('jquery');
        exports = factory(root, exports, Backbone, _, $);
    } else {
        root.Stemo = factory(root, {}, root.Backbone, root._, root.jQuery || root.Zepto || root.ender || root.$);
    }
}(this, function(root, Stemo, Backbone, _, $) {
	//Initial Public Interface
	var pub = Stemo = function() {
		var args = _.toArray(arguments); 
		if (args.length === 0 ) return;

		var obj = args[0];

		if (obj instanceof ModelArray || obj instanceof ModelObject) return obj;

		var rtn;

		if (isArray(obj)) rtn = new ModelArray(undefined, obj, args[1] || "global" );
		else rtn = new ModelObject(undefined, obj, args[1] || "global" );

		return rtn;
	};
	pub.SYNCTYPE = {
		both: "both",
		push: "push",
		pull: "pull"
	};

	// Current version.
	_.VERSION = '0.0.0';

	//Public utility functions
	var isArray = pub.isArray = function(obj) {
		if (typeof obj !== "object") return false;
		if (obj instanceof Array) return true;
		for (var key in obj) {
			if (isNumeric(key)) return true;
		}
		return false;
	};

	var typeOf = pub.typeOf = function (obj) {
		var type = typeof obj;
		if (type !== "object") return type;
		for (var key in obj) {
			if (isNumeric(key)) return 'array';
		}
		return 'object';
	};

	var isNumeric = pub.isNumeric = function (obj) {
		return !isNaN(parseFloat(obj)) && isFinite(obj);
	};

	var on = pub.on = function(on, path, name, callback) {
		var o = on;
	    path = path.replace(/\[(\w+)\]/g, '.$1');
	    path = path.replace(/^\./, '');
	    var a = path.split('.');
	    var levels = [];
	    var n;
	    while (a.length) {
	        n = a.shift();
	        if (typeof o === "object" && n in o) {
	        	levels.push(o);
	            o = o[n];
	        } else {
	            return;
	        }
	    }
    	if (!levels[ levels.length - 1 ].on) return false;
    	levels[ levels.length - 1 ].on(name+":"+n, callback);
    	return this;
	};

	var once = pub.once = function(on, path, name, callback) {
		var o = on;
	    path = path.replace(/\[(\w+)\]/g, '.$1');
	    path = path.replace(/^\./, '');
	    var a = path.split('.');
	    var levels = [];
	    var n;
	    while (a.length) {
	        n = a.shift();
	        if (typeof o === "object" && n in o) {
	        	levels.push(o);
	            o = o[n];
	        } else {
	            return;
	        }
	    }
    	if (!levels[ levels.length - 1 ].once) return false;
    	levels[ levels.length - 1 ].once(name+":"+n, callback);
    	return this;
	};

	var listenTo = pub.listenTo = function (subject, on, path, name, callback) {
		var o = on;
	    path = path.replace(/\[(\w+)\]/g, '.$1');
	    path = path.replace(/^\./, '');
	    var a = path.split('.');
	    var levels = [];
	    var n;
	    while (a.length) {
	        n = a.shift();
	        if (typeof o === "object" && n in o) {
	        	levels.push(o);
	            o = o[n];
	        } else {
	            return;
	        }
	    }
    	if (!levels[ levels.length - 1 ].on || !subject.listenTo) return false;
    	subject.listenTo ( levels[ levels.length - 1 ], name+":"+n, callback);
    	return this;
	};

	var listenToOnce = pub.listenTo = function (subject, on, path, name, callback) {
		var o = on;
	    path = path.replace(/\[(\w+)\]/g, '.$1');
	    path = path.replace(/^\./, '');
	    var a = path.split('.');
	    var levels = [];
	    var n;
	    while (a.length) {
	        n = a.shift();
	        if (typeof o === "object" && n in o) {
	        	levels.push(o);
	            o = o[n];
	        } else {
	            return;
	        }
	    }
    	if (!levels[ levels.length - 1 ].once || !subject.listenToOnce) return false;
    	subject.listenToOnce ( levels[ levels.length - 1 ], name+":"+n, callback);
    	return this;
	};


	var get = pub.get = function(on, path, parent) {
	    var o = on;
	    path = path.replace(/\[(\w+)\]/g, '.$1');
	    path = path.replace(/^\./, '');
	    var a = path.split('.');
	    var levels = [];
	    while (a.length) {
	        var n = a.shift();
	        if (typeof o === "object" && n in o) {
	        	levels.push(o);
	            o = o[n];
	        } else {
	            return;
	        }
	    }
	    if (parent) return levels[ levels.length - parent ];
	    return o;
	};

	var set = pub.set = function(on, path, value) {
		var a = path.split('.');
	    var o = on;
	    for (var i = 0, l = a.length - 1; i < l; i++) {
	        var n = a[i];
	        if (n in o) {
	            o = o[n];
	        } else {
	        	if ( isNumeric(a[i+1]) ) {
		            o[n] = new ModelArray(o, [], n);
		        } else {
		        	var nobj = {};
		            o[n] = new ModelObject(o, {}, n);
		        }
	            o.sync('push');
	            o = o[n];
	        }
	    }
	    if (value instanceof ModelObject || value instanceof ModelArray) value = mod.__from;
	    if (value === undefined) {
	    	if (isArray(o)) {
	    		o.splice(a[a.length - 1],1);
	    	} else {
		    	delete o[a[a.length - 1]];
		    }
	    } else {
		    o[a[a.length - 1]] = value;
		}
	    o.sync('push');
	    return on;
	};










	//Foundation Functionality
	var Model = function (parent, from, name) {
		Object.defineProperties(this, {
			_events: {
				value: {},
				writable: true,
				enumerable: false
			},
			__name: {
				value: name,
				writable: true,
				enumerable: false
			},
			__defined: {
				value: {},
				writable: true,
				enumerable: false
			},
			__from: {
				value: from,
				writable: true,
				enumerable: false
			},
			__parent: {
				value: parent,
				writable: true,
				enumerable: false
			},
			json: {
				get: function() {
					return this.__from;
				},
				set: function(v) {
					this.__from = v;
					this.sync('pull');
				}
			},
			parent: {
				get: function() {
					return this.__parent;
				}
			}
		});
		for (var key in from) {
			addProperty (from, this, key);
		}
	};
	Model.prototype.SYNCTYPE = pub.SYNCTYPE;
	_.extend(Model.prototype, Backbone.Events);
	_.extend(Model.prototype, {
		syncAll: function(SYNCTYPE) {
			this.sync(SYNCTYPE);
			var definedKeys = Object.keys(this.__defined);
			for (var i = 0, l = definedKeys.length; i < l; i++) {
				var key = definedKeys[i];
				if (this[key] instanceof ModelObject || this[key] instanceof ModelArray ) {
					this[key].syncAll(SYNCTYPE);
				}
			}
			return this;
		},
		sync: function(SYNCTYPE) {
			var modelKeys = Object.keys(this);
			var definedKeys = Object.keys(this.__defined);
			var fromKeys = Object.keys(this.__from);
			switch(SYNCTYPE) {
			case undefined: case "both":
				var diff = _.difference(modelKeys, definedKeys);
				for (var i = 0, l = diff.length; i < l; i++) {
					if (this[diff[i]] instanceof ModelObject || this[diff[i]] instanceof ModelArray ) {
						this.__from[diff[i]] = this[diff[i]].__from;
					} else {
						this.__from[diff[i]] = this[diff[i]];
					}
					delete this[diff[i]];
					addProperty(this.__from, this, diff[i]);
					var event = createEvent(0, "add", this, this, diff[i], this.__from[diff[i]], this, diff[i]);
					this.trigger("add", event);

					if (typeof this.__from[diff[i]] == "object") this[diff[i]].sync("both");
				}
				//from to model
				var diff = _.difference(definedKeys, modelKeys);
				for (var i = 0, l = diff.length; i < l; i++) {
					addProperty(this.__from, this, diff[i]);
					var event = createEvent(0, "add", this, this, diff[i], this.__from[diff[i]], this, diff[i]);
					this.trigger("add", event);

					if (typeof this.__from[diff[i]] == "object") this[diff[i]].sync("both");
				}

				//from to model
				var diff = _.difference(fromKeys, definedKeys);
				for (var i = 0, l = diff.length; i < l; i++) {
					addProperty(this.__from, this, diff[i]);
					var event = createEvent(0, "add", this, this, diff[i], this.__from[diff[i]], this, diff[i]);
					this.trigger("add", event);

					if (typeof this.__from[diff[i]] == "object") this[diff[i]].sync("pull");
				}
				break;
			case "push":
				//from to model
				var diff = _.difference(fromKeys, modelKeys);
				for (var i = 0, l = diff.length; i < l; i++) {
					delete this.__defined[diff[i]];
					delete this.__from[diff[i]];
					var event = createEvent(0, "remove", this, this, diff[i], this.__from[diff[i]], this, diff[i]);
					this.trigger("remove", event);
					
				}

				//model to from
				var diff = _.difference(modelKeys, definedKeys);
				for (var i = 0, l = diff.length; i < l; i++) {
					if (this[diff[i]] instanceof ModelObject || this[diff[i]] instanceof ModelArray ) {
						this.__from[diff[i]] = this[diff[i]].__from;
					} else {
						this.__from[diff[i]] = this[diff[i]];
					}
					delete this[diff[i]];
					addProperty(this.__from, this, diff[i]);
					var event = createEvent(0, "add", this, this, diff[i], this.__from[diff[i]], this, diff[i]);
					this.trigger("add", event);

					if (typeof this.__from[diff[i]] == "object") this[diff[i]].sync("push");
				}

				break;
			case "pull":
				//model to from
				var diff = _.difference(modelKeys, fromKeys);
				for (var i = 0, l = diff.length; i < l; i++) {
					delete this[diff[i]];
					delete this.__defined[diff[i]];
					var event = createEvent(0, "remove", this, this, diff[i], this.__from[diff[i]], this, diff[i]);
					this.trigger("remove", event);
					
				}

				//from to model
				var diff = _.difference(fromKeys, definedKeys);
				for (var i = 0, l = diff.length; i < l; i++) {
					addProperty(this.__from, this, diff[i]);
					var event = createEvent(0, "add", this, this, diff[i], this.__from[diff[i]], this, diff[i]);
					this.trigger("add", event);
					
					if (typeof this.__from[diff[i]] == "object") this[diff[i]].sync("pull");
				}
				break;
			default:
				throw new Error("Unsupported sync type: '" + SYNCTYPE + "'");
			}
		},
		set: function(path, value) {
		    return pub.set(this, path, value);
		},
		get: function(path) {
		   return pub.get(this, path);
		},
		extend: function(withThis) {
			_.extend(this.json, withThis);
			this.sync('pull');
			return this;
		}
	})











	//Object specific functioncality
	function ModelObject(parent, from, name) {
		Model.call(this, parent, from, name);
		this.on("add change remove", function( event ) {
			var cpath, ppath, lpath;
			lpath = (event.currentTargetPath || event.name);
			cpath = this.__name + "." + (event.currentTargetPath || event.name);
			ppath = this.__name + (event.currentParentPath ? "." + event.currentParentPath : "");
			

			if (event.currentParentPath != "") {
				var event4 = createEvent(event.bubbleCount, event.type + ":" + event.currentParentPath, event.target, event.currentTarget, event.currentTargetPath, event.value, event.proxy, event.name, event.currentParentPath );
				this.trigger(event.type + ":" + event.currentParentPath, event4 );
			}

			//var event1 = createEvent(event.bubbleCount, event.type + ":" + ppath, event.target, event.currentTarget, event.currentTargetPath, event.value, event.proxy, event.name, event.currentParentPath );
			//this.trigger(event.type + ":" + ppath, event1 );

			var event0 = createEvent(event.bubbleCount, event.type + ":" + lpath, event.target, event.currentTarget, event.currentTargetPath, event.value, event.proxy, event.name, event.currentParentPath );
			this.trigger(event.type + ":" + lpath, event0 );
			
			//var event2 = createEvent(event.bubbleCount, event.type + ":" + cpath, event.target, event.currentTarget, event.currentTargetPath, event.value, event.proxy, event.name, event.currentParentPath );
			//this.trigger(event.type + ":" + cpath, event2 );
			
			if (this.__parent) {
				var event3 = createEvent(event.bubbleCount+1, event.type, event.target, this.__parent, cpath, event.value, event.proxy, event.name, ppath );
				this.__parent.trigger(event.type, event3);
			}

		});
	}
	ModelObject.prototype = {};
	_.extend(ModelObject.prototype, Model.prototype);
	














	//Array specific functioncality
	function ModelArray(parent, from, name) {
		Model.call(this, parent, from, name);
		Object.defineProperties(this, {
			'__length': {
				'value': from.length,
				'configurable': true,
				'writable': true,
				'enumerable': false,
			},
			'length': {
				get: function() {
					return this.__length;
				},
				set: function(v) {
					this.__length = v;
				}
			}
		});
		this.on("add change remove", function( event ) {
			var cpath;
			var ppath;
			var lpath;
			if (isNumeric(event.currentTargetPath)) {
				lpath = (event.currentTargetPath || event.name);
				ppath = this.__name;
				cpath = this.__name + "[" + event.name + "]";
			} else {
				lpath = (event.currentTargetPath || event.name);
				ppath = this.__name;
				cpath = this.__name + "." + event.currentTargetPath;
			}

			if (event.currentParentPath != "") {
				var event4 = createEvent(event.bubbleCount, event.type + ":" + event.currentParentPath, event.target, event.currentTarget, event.currentTargetPath, event.value, event.proxy, event.name, event.currentParentPath );
				this.trigger(event.type + ":" + event.currentParentPath, event4 );
			}

			//var event1 = createEvent(event.bubbleCount, event.type + ":" + ppath, event.target, event.currentTarget, event.currentTargetPath, event.value, event.proxy, event.name, event.currentParentPath );
			//this.trigger(event.type + ":" + ppath, event1 );

			var event0 = createEvent(event.bubbleCount, event.type + ":" + lpath, event.target, event.currentTarget, event.currentTargetPath, event.value, event.proxy, event.name, event.currentParentPath );
			this.trigger(event.type + ":" + lpath, event0 );
			
			//var event2 = createEvent(event.bubbleCount, event.type + ":" + cpath, event.target, event.currentTarget, event.currentTargetPath, event.value, event.proxy, event.name, event.currentParentPath );
			//this.trigger( event.type + ":" + cpath, event2 );
			
			if (this.__parent) {
				var event3 = createEvent(event.bubbleCount+1, event.type, event.target, this.__parent, cpath, event.value, event.proxy, event.name, ppath );
				this.__parent.trigger(event.type, event3);
			}
		});
	}
	ModelArray.prototype = [];
	_.extend(ModelArray.prototype, Model.prototype);
	var trapNatives = [
		"concat",
		"every",
		"filter",
		"forEach",
		"indexOf",
		"join",
		"lastIndexOf",
		"map",
		"pop",
		"push",
		"reduce",
		"reduceRight",
		"reverse",
		"shift",
		"slice",
		"some",
		"sort",
		"splice",
		"toLocaleString",
		"toString",
		"unshift"
	];
	for (var i = 0, l = trapNatives.length; i < l; i++) {
		var a = trapNatives[i];
		createFunctionFrom(ModelArray.prototype, a, [], function() {
			this.sync('push');
		});
	}











	//Private utility functions
	function addProperty(object, proxy, name) {
		var childproxycache;
		proxy.__defined[name] = true;
		Object.defineProperty(proxy, name,
			{
				get: function() {
					if (typeof object[name] == "object") {
						if (childproxycache) return childproxycache;
						if (object[name] instanceof ModelObject || object[name] instanceof ModelArray) {
							if (isArray(object[name])) childproxycache = new ModelArray(proxy, object[name].json, name);
							else childproxycache = new ModelObject(proxy, object[name].json, name);
							return childproxycache;
						} else {
							if (isArray(object[name])) childproxycache = new ModelArray(proxy, object[name], name);
							else childproxycache = new ModelObject(proxy, object[name], name);
							return childproxycache;
						}
					} else {
						return object[name]; 
					}
				},
				set: function (value) {
					if (typeof value == "object") childproxycache = undefined;
					if (object[name] != value) {
						object[name] = value;
						var event = createEvent(0, "change", this, this, name, value, proxy, name);
						proxy.trigger("change", event);
					}
					return value;
				},
				enumerable: true,
				configurable: true
			}
		);
	}

	function createFunctionFrom(object, name, from, complete) {
		var args = _.toArray(arguments);
		args.splice(0,4);
		object[name] = function() {
			var rtn = from[name].apply(this, arguments);
			complete.apply(this, args);
			return rtn;
		};
	}

	function createEvent(bubbleCount, type, target, currentTarget, currentTargetPath, value, proxy, name, currentParentPath) {
		currentParentPath = currentParentPath === undefined ? "" : currentParentPath;
		var event = { bubbles: true, cancelBubble: false, cancelable: true, defaultPrevented: false, returnValue: true };
		event.bubbleCount = bubbleCount;
		event.target = target;
		event.currentParentPath = currentParentPath;
		event.currentTargetPath = currentTargetPath;
		event.value = value;
		event.currentTarget = currentTarget;
		event.proxy = proxy;
		event.name = name;
		event.type = type;
		event.bubbles = true;
		event.stopPropagation = function() {
			this.cancelBubble = true;
		};
		event.preventDefault = function() {
			this.defaultPrevented = true;
			this.returnValue = false;
		}
		return event;
	}

	return pub;

}));