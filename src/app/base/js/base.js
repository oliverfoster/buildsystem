define(function() {

	var base = window.base = {};
	_.extend(base, Backbone.Events);
	base.readyQueue = (new Waiter.Queue());

	base.on("base:addTaskToReadyQueue", addTaskToReadyQueue);
	base.readyQueue.once("ready", readyQueueReady);
	base.listenTo(core.device, "change:size change:ratio", setCSSSize);

	function addTaskToReadyQueue () {
		return base.readyQueue.async.apply(this, arguments);
	}

	function readyQueueReady() {
		base.off("base:addTaskToReadyQueue");
		defer( base.trigger, base, ["router:start"] );
	}

	base.$html = $("html");
	function setCSSSize() {
		base.$html.removeClass("extrasmall small normal large extralarge");
		base.$html.removeClass("extralong long portrait landscape wide extrawide");
		base.$html.addClass(core.device.size);
		base.$html.addClass(core.device.ratio);
	}
	setCSSSize();

	return base;
});

