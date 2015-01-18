define(['./base'], function() {

	base.trigger("base:addTaskToReadyQueue", load);
	$(window).one("unload", unload);

	base.once("document:ended", clearDOM);

	function load(task) {
		
		base.once("data:ready", function() {		

			setupTemplatesAsPartials();
			setupDocumentWrapper();

			defer(base.trigger, base, ["document:started"]);

			task.ready();

		});

	}

	function unload() {
		base.trigger("document:ended");
	}

	function setupTemplatesAsPartials() {
		var templates = base.templates;
		for(var k in templates) {
			Handlebars.registerPartial(k, templates[k]);
		}
	}

	function setupDocumentWrapper() {
		var templates = base.templates;
		var wrapper = $(templates.wrapper());
		$('body').append(wrapper);
		base.$wrapper = wrapper;
	}

	function clearDOM() {
		base.trigger("document:clear");
		base.$wrapper.html("");
		defer(base.trigger, base, ["document:cleared"]);
	}	

});