define(['./base'], function() {

	base.trigger('base:addTaskToReadyQueue', buildsystemDataProcessor);

	function buildsystemDataProcessor(task) {
		buildsystem.once("add:data.buffer", defer(function() {
			convertBuildSystemDataToBaseData(task);
		}));
	}

	function convertBuildSystemDataToBaseData(task) {
		
		var data = buildsystem.data.buffer.pop();

		var config = data.object.json;

		var configDefaults = {
			languages: {
				default: "en",
				current: config.languages.default || "en"
			},
			themes: {
				default: "vanilla",
				current: config.themes.default || "vanilla"
			}
		};

		base.config = $.extend(true, configDefaults, config);
		base.data = data.array;
		
		document.templates = buildsystem.templates.json;

		base.sync("push");

		base.trigger("data:ready");
		task.ready();

	}


});