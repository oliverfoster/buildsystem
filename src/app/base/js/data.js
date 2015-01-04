define(['./base'], function() {

	core.once("add:data.buffer", function() {

		var data = core.data.buffer.pop();
		base.config = new Stemo(data.object);
		base.data = new Stemo(data.array);
		base.templates = core.templates;

		base.trigger('base:readyQueue', function(task) {
	
			base.trigger("base:dataLoaded", base.config, base.data);
			task.ready();

		});

	});


});