define(['app/base/js/base', 'app/base/js/router'], function(base) {

	var dynamicTrigger;
	var currentMapId;
	var currentMapChoiceId;

	base.on("router:route:app", routeAppTo);

	function routeAppTo() {
		if (dynamicTrigger) dynamicTrigger.stopListening();

		switch ( arguments[0] ) {
		case "id":
			var id = arguments[1];
			var args = _.toArray(arguments);
			routeByMapId(id, args);
		}

		function routeByMapId(id, args) {

			var map = base.map._byId[id].json;

			if (map === undefined ) {
				console.log("Map id not found: " + id );
				return;
			}

			if (map._tier !== "map") {
				console.log("Id found, not a map: " + id );
				return;
			}

			switch (map._type) {
			case "component":
				//put checking for current document id and goto component via scroll or such in the parent view
				map = base.map._byId[map._parentId].json;
				break;
			}

			switch (map._type) {
			case "document":
				routeToDocument(map, args);
				break;
			default:
				return;
			}

			function routeToDocument(map, args) {
				if (map._choice) {

					for (var i = 0, l = map._choice.length; i < l; i++) {
						map._choice[i]._choiceId = i;
					}

					var context = {base: base, window: window};

					var choice = _.compare(context, map._choice, { removeComparitor: false });
					map = _.extend(map, choice);

					if (map._dynamic && choice) setupDynamicListener(map, args);

				}

				if (map._id == currentMapId && map._choiceId == currentMapChoiceId) return;
				currentMapChoiceId = map._choiceId;
				currentMapId = map._id;

				if (map._viewId) {
				
					base.trigger("document:new", map);

					base.trigger("router:routing:app:id", map._id );

					base.trigger("document:add", map, "#wrapper");

					base.trigger("router:route:app:id", map._id );

					base.trigger("router:routed:app:id", map._id );

				} else {

					console.log("No _view attribute found at: " + map._id);
				}

				function setupDynamicListener(map, args) {

					if (dynamicTrigger === undefined) dynamicTrigger = new Backbone.Waiter.Trigger(function() {
						base.trigger.apply( base, ["router:route:app"].concat(args) );
					});

					var context = {base: base, window: window};

					for (var k in map._where) {
						Stemo.listenTo( dynamicTrigger, context, k, "change", dynamicTrigger.trigger );
					}
				}

			}
		}	
	}


});