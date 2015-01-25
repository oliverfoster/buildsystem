define(['./base'], function() {

	base.trigger("base:addTaskToReadyQueue", routerReady);

	function routerReady(task) {
		
		base.trigger("router:ready", base.router);
		task.ready();

	}

	var Router = Backbone.Router.extend({
		routes: {},
		isStarted: false,

		initialize: function() {
			var route = createRoute();
			this.route(route, "default", _.bind(this.routeTo, this));

			function createRoute() {
				var name = ":type/:1";
				for (var i = 0, l = 100; i < l; i++) {
					name += "(/:" + (i+2) + ")";
				}
				return name;
			}
			
		},

		routeTo: function(type) {

			var args = _.toArray(arguments);
			type = getRouteType(args);
			args = trimNullParameters(args);

			runRouteEvents(args); 

			function getRouteType(args) {
				return args.shift();
			}

			function trimNullParameters(args) {
				for (var i = args.length - 1, l = -1; i > l; i--) {
					if (args[i] === null) args.pop();
					else break;
				}
				return args;
			}

			function runRouteEvents(args) {
				args.unshift("router:route:"+type);
				defer( base.trigger, base, args , function() {
					args[0] = "router:routed:"+type;
					defer( base.trigger, base, args );  
				}); 
			}
			
		},

		start: function() {

			var _id = base.config.start.map;
			var startDelayMilliseconds = base.config.start.delay || 0;

			delay(startNavigation, this, startDelayMilliseconds);

			function startNavigation() {

				Backbone.history.start();

				if (window.location.href.indexOf("#") === -1 || (base.config.start.force ))  defer(function() {
					
					this.navigate("app/id/" + _id, {trigger: true});

				}, this);

			}

		}
	});

	var router = new Router();
	router.listenToOnce(base, "router:start", router.start);
	
});