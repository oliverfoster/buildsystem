define(['app/base/js/behaviour'], function() {

	var Default = base.behaviour.get("Default");

	var PageMenuComponent = Default.extend({ 
		
		_prepareDOM: function() {
			this.data = this.model.json;

			var from = [this.data.view, this.data.data, this.data.map];

			var combinedClassNames = [];
			combinedClassNames = combinedClassNames.concat( _.reject( _.pluck(from, "_className"), function(item) { return item === undefined; } ) );
			combinedClassNames = combinedClassNames.concat( _.reject( _.pluck(from, "_type"), function(item) { return item === undefined; } ) );
			combinedClassNames = combinedClassNames.concat( _.reject( _.pluck(from, "_template"), function(item) { return item === undefined; } ) );
			combinedClassNames = _.uniq( combinedClassNames.join(" ").split(" ") ).join(" ");

			var attributes = _.reject( _.pluck(from, "_attributes"), function(item) { return item === undefined; } );
				attributes.unshift({});
			var extendedAttributes = _.extend.apply( _ , attributes );

			var lastId = _.last( _.reject( _.pluck(from, "_id"), function(item) { return item === undefined; } ) );

			var lastTagName = _.last( _.reject( _.pluck(from, "_tagName"), function(item) { return item === undefined; } ) );


			var combinedEvents = {};
			combinedEvents = _.extend({}, from[0]._events, from[1]._events, from[2]._events);

			return {
				_attributes: extendedAttributes,
				_id: lastId,
				_classes: combinedClassNames,
				_tagName: lastTagName,
				_events: combinedEvents
			};

		},

		_construct: function() {

		},

		_preRender: function() {
			this.data = this.model.json;
		},

		_render: function() {
			if (this.data.view && this.data.view._id) {
				if (base.templates[this.data.view._id]) {
					this.$el.html(base.templates[this.data.view._id](this.data));
					return;
				} 
			}

			this.$el.html(base.templates.placeholder(this.data));
		},

		_postRender: function() {
			delete this.data;
		},

		_remove: function() {

		}

	});

	base.behaviour.register("PageMenuComponent", PageMenuComponent);

	return PageMenuComponent;

});