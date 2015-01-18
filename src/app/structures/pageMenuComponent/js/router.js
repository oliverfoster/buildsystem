define(['app/base/js/router'], function() {

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
			routeById(id, args);
		}
	}

	function routeById(id, args) {

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
				//put checking for current page / menu id and goto component via scroll or such in the parent view
				map = base.map._byId[map._parentId].json;
				break;
			}

			switch (map._type) {
			case "menu":
			case "page":
				routeToMenuOrPage(map, args);
				break;
			default:
				return;
			}
	}

	function routeToMenuOrPage(map, args) {
		if (map._choice) {

			for (var i = 0; i < map._choice.length; i++) {
				map._choice[i]._choiceId = i;
			}

			var choice = compare(window, map._choice);
			map = _.extend(map, choice);

			if (map._dynamic) setupDynamicListener(map, args);

		}

		if (map._id == currentMapId && map._choiceId == currentMapChoiceId) return;
		currentMapChoiceId = map._choiceId;
		currentMapId = map._id;

		base.trigger("router:router:app:id", map._id );

		if (map._view && map._data) {
		
			base.trigger("document:new");
			base.trigger("document:add", map);

		} else {

			console.log("No _view and _data attribute found at: " + map._id);
		}

	}

	function setupDynamicListener(map, args) {

		if (dynamicTrigger === undefined) dynamicTrigger = new Waiter.Trigger(function() {
			base.trigger.apply( base, ["router:route:app"].concat(args) );
		});

		for (var k in map._where) {
			Stemo.listenTo( dynamicTrigger, window, k, "change", dynamicTrigger.trigger );
		}
	}

});