define(['app/base/js/view'], function() {

	var Default = base.registerGet("pattern","Default");
	var SpecialBehaviour = Default.extend({ 
		
		_prepareDOM: function() {},

		_construct: function() {},

		_events: function() {},

		_preRender: function() {},

		_render: function() {},

		_postRender: function() {},

		_remove: function() {}

	});

	base.register("pattern", "SpecialBehaviour", SpecialBehaviour);
	base.register("behaviour", "SpecialBehaviour", SpecialBehaviour);

	return newView;

});