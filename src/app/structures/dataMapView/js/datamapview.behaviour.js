define(['app/base/js/base', 'app/base/js/doc', 'app/base/js/behaviour'], function(base, doc) {

	var Default = doc.behaviours.Default;

	var triggerParserRepl = /\'/g;
	var DataMapView = Default.extend({ 
		
		_prepareDOM: function() {
			if (this.model.data) pickLanguage.call(this);

			this.data = this.model.json;

			var from = [this.data.view, this.data.map];
			if (this.data.data) from.push(this.data.data);

			var combinedClassNames = [];
			combinedClassNames = combinedClassNames.concat( _.reject( _.pluck(from, "_classes"), function(item) { return item === undefined; } ) );
			combinedClassNames = combinedClassNames.concat( _.reject( _.pluck(from, "_type"), function(item) { return item === undefined; } ) );
			combinedClassNames = combinedClassNames.concat( _.reject( _.pluck(from, "_template"), function(item) { return item === undefined; } ) );
			combinedClassNames = _.uniq( combinedClassNames.join(" ").split(" ") ).join(" ");

			var attributes = _.reject( _.pluck(from, "_attributes"), function(item) { return item === undefined; } );
				attributes.unshift({});
			var extendedAttributes = _.extend.apply( _ , attributes );

			var lastId = _.last( _.reject( _.pluck(from, "_id"), function(item) { return item === undefined; } ) );

			var lastTagName = _.last( _.reject( _.pluck(from, "_tagName"), function(item) { return item === undefined; } ) );

			var lastTemplate = _.last( _.reject( _.pluck(from, "_template"), function(item) { return item === undefined; } ) );

			this.template = lastTemplate;

			var combinedEvents = _.extend({}, defaultEvents);
			for (var i = 0, l = from.length; i < l; i++) {
				if (from[i]._events) combinedEvents = _.extend(combinedEvents, from[i]._events);	
			}



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
			if (this.model.data) pickLanguage.call(this);
			this.data = this.model.json;

		},

		_render: function() {
			if (this.data.view && this.data.view._id) {
				if (doc.templates[this.template]) {
					this.$el.html(doc.templates[this.template](this.data));
					return;
				} 
			}

			this.$el.html(doc.templates.placeholder(this.data));
		},

		_postRender: function() {
			delete this.data;
		},

		_remove: function() {

		},

		_triggerEvent: function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			var events = $(event.currentTarget).attr("data-triggers");
			if (!events || events === "") return;

			events = events.replace(triggerParserRepl, '"');
			try {
				events = JSON.parse(events);
			} catch(e) {
				return;
			}

			for (var i = 0, l = events.length; i < l; i++) {
				var triggerItem = events[i];
				if (triggerItem.on) {
					var on = Stemo.get(this, triggerItem.on);
					if (!on) on = Stemo.get(window, triggerItem.on);
					on.trigger(triggerItem.name, event);
				} else {
					this.trigger(triggerItem.name, event);
				}
			}
			
		},

		_animate: function() {
			if (this.map._animation) {
				var animation = this.map._animation;
				if (animation instanceof Array) {
					for (var i = 0, l = animation.length; i < l; i++) {
						this.$el.velocity(animation[i].type, animation[i].options);
					}
				} else {
					this.$el.velocity(animation.type, animation.options);
				}
			}
		}


	});

	function pickLanguage() {
		var model = this.model.json;
		var language = model.config.languages.current || model.config.languages.default || "en";
		if (model.data._language && model.data._language[language]) {
			model._language = model.data._language[language];
			for (var text in model._language) {
				model._language[text] = Handlebars.compile(model._language[text])(model);
			}
			this.model.sync("pull");
		}
		
	}

	var defaultEvents = {
		"click [data-triggers]": "_triggerEvent"
	};

	doc.behaviours.DataMapView = DataMapView;

	return DataMapView;

});