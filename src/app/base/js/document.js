define(['./base'], function() {

	base.trigger("base:addTaskToReadyQueue", load);
	$(window).one("unload", unload);

	function load(task) {
		
		base.once("data:ready", startDocument);

		function startDocument() {
			setupTemplatesAsPartials();
			setupDocumentWrapper();

			task.ready();

			defer(base.trigger, base, ["document:started"]);

			function setupTemplatesAsPartials() {
				var templates = document.templates;
				for(var k in templates) {
					Handlebars.registerPartial(k, templates[k]);
				}
			}

			function setupDocumentWrapper() {
				var templates = document.templates;
				var wrapper = $(templates.wrapper());
				$('body').append(wrapper);
			}
		}

	}

	function unload() {
		clearDOM();
		base.trigger("document:ended");

		function clearDOM() {
			base.trigger("document:clear");
			$("#wrapper").html("");
			defer(base.trigger, base, ["document:cleared"]);
		}
	}

});