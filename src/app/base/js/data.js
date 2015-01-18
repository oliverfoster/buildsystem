define(['./base'], function() {

	base.trigger('base:addTaskToReadyQueue', coreDataProcessor);

	function coreDataProcessor(task) {
		core.once("add:data.buffer", _.defer(function() {
			convertCoreDataToBaseData(task);
		}));
	}

	function convertCoreDataToBaseData(task) {
		
		var data = core.data.buffer.pop();
		base.config = new Stemo(data.object);
		base.data = new Stemo(data.array);
		base.templates = core.templates;

		base.trigger("data:ready");
		task.ready();

	}


});