define(["app/structures/dataMapView/js/datamapview.router"], function() {

	base.on("router:route:app:id", routeByMapId);

	function routeByMapId(mapId) {
		var map = base.map._byId[mapId].json;

		if (map === undefined ) {
			console.log("Map id not found: " + id );
			return;
		}

		var i, l;

		var bars = [];
		for (i = 0, l = map._extensions.length; i < l; i++) {
			var extension = map._extensions[i];
			var extensionMap;
			if (typeof extension === "string") {
				extensionMap = base.map._byId[extension];

				if (extensionMap === undefined) {
					console.log("Map id not found: " + id );
					return;
				}

				extensionMap = extensionMap.json;

			} else if (typeof extension === "object") {
				extensionMap = extension;
			}

			if (extensionMap._type == "bar") {
				bars.push(extensionMap);
			}		
		}

		if (bars.length === 0) return;

		for (i = 0, l = bars.length; i < l; i++) {
			var barMap = bars[i];
			if (barMap._viewId) {
					
				base.trigger("document:add", barMap, "#prewrapper");

			} else {

				console.log("No _view attribute found at: " + map._id);
			}
		}

	}

});