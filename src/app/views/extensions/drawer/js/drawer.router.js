define(["app/structures/dataMapView/js/datamapview.router"], function() {

	base.on("router:postRoute:app:id", routeByMapId);

	function routeByMapId(mapId) {
		var map = base.map._byId[mapId].json;

		if (map === undefined ) {
			console.log("Map id not found: " + id );
			return;
		}

		var i, l;

		var drawers = [];
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
		}

		if (drawers.length === 0) return;

		for (i = 0, l = drawers.length; i < l; i++) {
			var drawerMap = drawers[i];
			if (drawerMap._viewId) {
					
				base.trigger("document:add", drawerMap, "#prewrapper");

			} else {

				console.log("No _view attribute found at: " + map._id);
			}
		}

	}

});