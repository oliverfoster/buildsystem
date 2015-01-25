define(function() {

	var defaultBaseValues = {
		size: "undefined",
		ratio: "undefined"
	};
	var base = window.base = new Stemo(defaultBaseValues);
	
	var readyQueue = (new Backbone.Waiter.Queue());
	readyQueue.once("ready", queueReady);

	base.on("base:addTaskToReadyQueue", addTaskToReadyQueue);

	function addTaskToReadyQueue () {
		return readyQueue.async.apply(this, arguments);
	}

	function queueReady() {
		readyQueue.destroy();
		
		clearupQueue();
		startRouter();

		function clearupQueue() {
			base.off("base:addTaskToReadyQueue");
			readyQueue = undefined;
		}

		function startRouter() {
			$(document).ready(function() {
				defer( base.trigger, base, ["router:start"] );
			});
		}
	}

	
	$(window).resize(fetchWindowSizeToEventSystem);

	function fetchWindowSizeToEventSystem() {
		window.base.size = window.size;
		window.base.ratio = window.ratio;
	}

	fetchWindowSizeToEventSystem();

	return base;
});

