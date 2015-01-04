define(['app/base/js/router'], function() {

	var dynamicTrigger;
	var currentId;

	base.on("router:route:app", function() {

		if (dynamicTrigger) dynamicTrigger.stopListening();

		switch ( arguments[0] ) {
		case "id":
			var id = arguments[1];
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


			if (currentId == id) return;

			var view, data, config, viewConstructor;

			switch (map._type) {
			case "menu":
			case "page":
				base.trigger("document:new");

				if (map._choice) {

					var choice = compare(window, map._choice);
					map = _.extend(map, choice);

					if (map._dynamic) {
						var args = _.toArray(arguments);

						if (dynamicTrigger === undefined) dynamicTrigger = new Waiter.Trigger(function() {
							base.trigger.apply( base, ["router:route:app"].concat(args) );
						});

						for (var k in map._where) {
							Stemo.listenTo( dynamicTrigger, window, k, "change", dynamicTrigger.trigger );
						}
					}

				}

				if (map._view && map._data) {
				
					view = base.view._byId[map._view];
					data = base.data._byId[map._data];
					config = base.config;

					viewConstructor = base.registerGet("behaviour", view._behaviour);

					var page = new viewConstructor({
						model: new Stemo({
							map: map,
							view: view.json,
							data: data.json,
							config: config.json
						})
					});
					base.$wrapper.append(page.$el);

					

				} else {

					console.log("No _view and _data attribute found at: " + map._id);
				}

				break;
			default:
				return;
			}
		}
	});

});