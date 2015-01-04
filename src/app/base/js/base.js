define(function() {

	var base = window.base = {};
	_.extend(base, Backbone.Events);

	base.readyQueue = (new Waiter.Queue());

	base.on("base:readyQueue", base.readyQueue.async);

	return base;
});

