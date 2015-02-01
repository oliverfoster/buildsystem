define(['app/base/js/base', 'app/base/js/behaviour'], function(base) {

	var Default = base.behaviour.get("Default");
	
	var SpecialBehaviour = Default.extend({ 
		
		_prepareDOM: function() {},

		_construct: function() {},

		_events: function() {},

		_preRender: function() {},

		_render: function() {},

		_postRender: function() {},

		_remove: function() {}

	});

	base.behaviour.register("SpecialBehaviour", SpecialBehaviour);

	return newView;

});