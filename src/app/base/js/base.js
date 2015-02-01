define(function() {

	var defaultBaseValues = {
		size: "undefined",
		ratio: "undefined"
	};
	var base = new Stemo(defaultBaseValues);
	
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

	var $html = $("html");

	function fetchWindowSizeToEventSystem() {
		base.size = window.size;
		base.ratio = window.ratio;		
	}

	function applyCSSStyles() {
		$html.removeClass("extrasmall small normal large extralarge");
		$html.removeClass("extralong long portrait landscape wide extrawide");
		$html.addClass(base.size);
		$html.addClass(base.ratio);
	}

	base.on("change:size change:ratio", applyCSSStyles);

	fetchWindowSizeToEventSystem();

	return base;
});

