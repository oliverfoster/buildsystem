define(['./base'], function() {

	base._ = base._ || {};
	var register = base._.register = {};
	
	base.register = function(type, name, value) {
		register[type] = register[type] || {};
		register[type][name] = value;
		defer( base.trigger, base, ["view:registered", type, name, value] );
	};

	base.registerGet = function(type, name) {
		if (register[type] && register[type][name]) return register[type][name];
		return undefined;
	};


	base.trigger("base:readyQueue", function(task) {
		
		base.trigger("registry:started", base);
		task.ready();

	});

});