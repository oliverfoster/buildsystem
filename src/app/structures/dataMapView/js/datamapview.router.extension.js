define(['app/base/js/base'], function(base) {

	base.on("router:route:app:id", routeByMapId);

	function routeByMapId(mapId) {
		var map = base.map._byId[mapId].json;

		if (map === undefined ) {
			console.log("Map id not found: " + id );
			return;
		}

		var i, l;

		var extensions = [], extension, extensionMap;
		if (map._extensions instanceof Array) {
			for (i = 0, l = map._extensions.length; i < l; i++) {
				extension = map._extensions[i];
				extensionMap = getExtensionMap(extension);
				if (extensionMap === undefined) continue;
				extensions.push(extensionMap);
			}
		} else {
			for (extension in map._extensions) {
				extensionMap = getExtensionMap(extension);
				if (extensionMap === undefined) continue;
				extensions.push(extensionMap);
			}
		}

		if (extensions.length === 0) return;

		for (i = 0, l = extensions.length; i < l; i++) {
			extensionMap = extensions[i];
			if (extensionMap._viewId) {
					
				base.trigger("document:add", extensionMap, "#prewrapper");

			} else {

				console.log("No _view attribute found at: " + extensionMap._id);
			}
		}

	}

	function getExtensionMap(map) {
		var extensionMap;
		if (typeof map === "string") {
			extensionMap = base.map._byId[map];

			if (extensionMap === undefined) {
				console.log("Map id not found: " + id );
				return;
			}

			extensionMap = extensionMap.json;

		} else if (typeof map === "object") {
			extensionMap = map;
		}
		if (extensionMap._type !== "extension") return;
		return extensionMap;

	}

});