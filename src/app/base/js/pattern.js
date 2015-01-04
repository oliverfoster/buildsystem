define(['./registry'], function() {

	var Default = Backbone.View.extend({

		_isReady: false,
		_preparedDOM: false,

		attributes: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") {
				this._preparedDOM = this._prepareDOM();
				if (typeof this._preparedDOM === "object") return this._preparedDOM._attributes;
			} else if (typeof this._preparedDOM === "object") return this._preparedDOM._attributes;
		},

		id: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") {
				this._preparedDOM = this._prepareDOM();
				if (typeof this._preparedDOM === "object") return this._preparedDOM._id;
			} else if (typeof this._preparedDOM === "object") return this._preparedDOM._id;
		},

		className: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") {
				this._preparedDOM = this._prepareDOM();
				if (typeof this._preparedDOM === "object") return this._preparedDOM._className;
			} else if (typeof this._preparedDOM === "object") return this._preparedDOM._className;
		},

		tagName: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") {
				this._preparedDOM = this._prepareDOM();
				if (typeof this._preparedDOM === "object") return this._preparedDOM._tagName;
			} else if (typeof this._preparedDOM === "object") return this._preparedDOM._tagName;
		},

		initialize: function(options) {

			if (this._prepareDOM) delete this._prepareDOM;

			base.trigger("document:add", this);

			if (this._remove) this.listenTo(this, "remove", this._remove);
			
			if (this.reRender) {
				this.reRender();
				if (this.model) this.listenTo(this.model, "change", this.reRender);
			}
			if (typeof this._contruct === "function") this._construct();
		},

		events: function() {
			if (!this._preparedDOM && typeof this._prepareDOM === "function") {
				this._preparedDOM = this._prepareDOM();
				if (typeof this._preparedDOM === "object") return this._preparedDOM._events;
			} else if (typeof this._preparedDOM === "object") return this._preparedDOM._events;
		},

		reRender: function() {

			if (this._preRender) this._preRender();
			base.trigger("view:preRender", this);
			this.render();
			base.trigger("view:render", this);
			if (this._postRender) this._postRender();
			base.trigger("view:postRender", this);

			this._isReady = true;
			this.trigger("ready");
			base.trigger("view:ready", this);
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
			this.contructor.__super__.remove();
			if (this._remove) this._remove();
			base.trigger("document:remove", this, false);
		}

	});

	base.register("pattern", "Default", Default);

	base.trigger("base:readyQueue", function(task) {
		
		base.trigger("plugin:ready", base.router);		
		task.ready();

	});

});