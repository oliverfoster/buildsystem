define(['./base'], function() {

	base.trigger("base:addTaskToReadyQueue", behaviourReady);

	function behaviourReady(task) {
		
		base.trigger("behaviour:ready", Default);		
		task.ready();

	}

	var delegateEventSplitter = /^(\S+)\s*(.*)$/;

	var Default = Backbone.View.extend({

		_isRendered: false,
		_preparedDOM: false,
		_template: "placeholder",

		attributes: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") this._preparedDOM = this._prepareDOM();
			if (typeof this._preparedDOM === "object") return this._preparedDOM._attributes;
		},

		id: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") this._preparedDOM = this._prepareDOM();
			if (typeof this._preparedDOM === "object") return this._preparedDOM._id;
		},

		className: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") this._preparedDOM = this._prepareDOM();
			if (typeof this._preparedDOM === "object") return this._preparedDOM._classes;
		},

		tagName: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") this._preparedDOM = this._prepareDOM();
			if (typeof this._preparedDOM === "object") return this._preparedDOM._tagName;
		},

		initialize: function(options) {

			_.extend(this, options);

			if (this._prepareDOM) delete this._prepareDOM;

			if (this._remove) this.listenTo(this, "remove", this._remove);
			
			if (typeof this._contruct === "function") this._construct();


			this.trigger("initialized");
			base.trigger("behaviour:initialized", this);
		},

		events: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") this._preparedDOM = this._prepareDOM();
			if (typeof this._preparedDOM === "object") return this._preparedDOM._events;
		},

		delegateEvents: function(events) {
			if (!this._isRendered) return undefined;
			//fetch and combine available event data
			/*
				BACKBONE:

					onThisElementEventName: *,
					onThisElementEventName atThisElementJQuerySubSelectors: *,

					* : executeThisObjectFunctionName


				PAGEMENUCOMPONENT:

					{ onThisObjectEventName: *,
					{ atGlobalObjectString onGlobalObjectEventName: *.

					* : } triggerThisObjectEventName,
					* : } atGlobalObjectString triggerGlobalObjectEventName,
					* : > gotoThisURL

			*/
			if (!(events || (events = _.result(this, 'events')))) return this;
			this.undelegateEvents();
			for (var key in events) {
				var method = events[key];
				if (!_.isFunction(method)) method = this[events[key]];
				if (!method) continue;

				var match = key.match(delegateEventSplitter);
				var eventName = match[1], selector = match[2];
				method = _.bind(method, this);
				eventName += '.delegateEvents' + this.cid;
				if (selector === '') {
					this.$el.on(eventName, method);
				} else {
					this.$el.on(eventName, selector, method);
				}
			}
			return this;
		},

		undelegateEvents: function() {
			this.$el.off('.delegateEvents' + this.cid);
      		return this;
		},

		draw: function() {
			this.undelegateEvents();
			if (this._preRender) this._preRender();
			this.trigger("preRendered");
			base.trigger("behaviour:preRendered", this);
			this.render();
			this.trigger("rendered");
			base.trigger("behaviour:rendered", this);
			this._isRendered = true;
			if (this._postRender) this._postRender();
			this.trigger("postRendered");
			base.trigger("behaviour:postRendered", this);
		},

		render: function() {
			if (typeof this._render === "function") this._render();
			else {
				var data = this.model.json;

				if (this._template) {
					if (base.templates[this._template]) {
						this.$el.html(base.templates[this._template](data));
						return;
					}
				}

				this.$el.html(base.templates.placeholder(data));
			}
		},

		remove: function() {
			this._isRendered = false;
			Backbone.View.prototype.remove.apply(this, arguments);
			if (this._remove) this._remove();
			this.trigger("removed");
			base.trigger("behaviour:removed", this);
		}

	});

	document.behaviours = {};
	document.behaviours.Default = Default;

});