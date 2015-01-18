define(['./base'], function() {

	base.trigger("base:addTaskToReadyQueue", routerReady);

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

		start: function() {

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

	var router = new Router();
	router.listenToOnce(base, "router:start", router.start);

	function routerReady(task) {
		
		base.trigger("router:ready", base.router);
		task.ready();

	}
	
});