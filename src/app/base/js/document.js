define(['./base'], function() {

	base._ = base._ || {};
	var documentViews = base._.documentViews = [];

	$(window).one("unload", function() {
		base.trigger("document:ended");
	});

	base.on("document:clear document:new document:ended", function() {
		base.trigger("document:removeAll");
		
		base.$wrapper.html("");
		defer(base.trigger, base, ["document:cleared"]);
	});

	base.on("document:add", function(view) {
		documentViews.push(view);
		defer(base.trigger, base, ["document:added", view]);
	});

	base.on("document:remove", function(view, trigger) {
		trigger = trigger === undefined ? false : trigger;
		if (trigger) {
			view.trigger("remove");
		} else {
			for (var i = documentViews.length - 1; i > -1; i--) {
				if (documentViews[i].cid == view.cid) documentViews.splice(i,1);
			}
			defer(base.trigger, base, ["document:removed", view]);
		}
	});

	base.on("document:removeAll", function() {
		for (var i = documentViews.length - 1; i > -1; i--) {
			base.trigger("document:remove", documentViews[i], true);
		}
		defer( base.trigger, base, ["document:removedAll"] );
	});

	base.trigger("base:readyQueue", function(task) {
		
		base.once("base:dataLoaded", function() {		

			var templates = base.templates;
			for(var k in templates) {
				Handlebars.registerPartial(k, templates[k]);
			}
			var wrapper = $(templates.wrapper());
			$('body').append(wrapper);
			base.$wrapper = wrapper;

			defer(base.trigger, base, ["document:started"]);

			task.ready();

		});

	});

});