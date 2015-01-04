define(['./base'], function() {

	base._ = base._ || {};

	var Router = Backbone.Router.extend({
		routes: {},
		isStarted: false,

		initialize: function() {
			var name = ":type/:1";
			for (var i = 0; i < 100; i++) {
				name += "(/:" + (i+2) + ")";
			}
			this.route(name, "default", _.bind(this.routeTo, this));
		},

		routeTo: function(type) {
			var args = _.toArray(arguments);
			type = args.shift();
			for (var i = args.length - 1; i > -1; i--) {
				if (args[i] === null) args.pop();
				else break;
			}
			args.unshift("router:route:"+type);
			defer( base.trigger, base, args , function() {
				args[0] = "router:routed:"+type;
				defer( base.trigger, base, args );  
			}); 
		},

		load: function() {

			var _id = base.config.start.map;

			$(delay(function() {

				delete base.readyQueue;

				Backbone.history.start();

				if (window.location.href.indexOf("#") === -1 || (base.config.start.force ))  defer(function() {
					
					this.navigate("app/id/" + _id, {trigger: true});

				}, this);

			}, this, base.config.start.delay || 0 ));

		}
	});


	base.router = new Router();

	base.trigger("base:readyQueue", function(task) {
		
		base.trigger("router:started", base.router);
		task.ready();

	});

	base.router.listenToOnce(base.readyQueue, "ready", base.router.load);
	
});