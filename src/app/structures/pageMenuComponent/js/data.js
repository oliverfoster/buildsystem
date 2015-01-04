define(['app/base/js/data'], function() {	
	
	var dataTypes = [ "page", "menu", "component" ];

	base.on("base:dataLoaded", function(config, data) {
			
		base.byId = _.indexBy(data, "_id");

		base.data = { _byId: _.indexBy( _.where(data, {"_tier": "data" }), "_id" ) };
		base.map = { _byId: _.indexBy( _.where(data, {"_tier": "map" }), "_id" ) };
		base.view = { _byId: _.indexBy( _.where(data, {"_tier": "view" }), "_id" ) };

		for (var i = 0; i < dataTypes.length; i++) {

			var type = dataTypes[i];
			base.data[type] = _.where(data, {"_type": type, "_tier": "data" });
			base.map[type] = _.where(data, {"_type": type, "_tier": "map" });
			base.view[type] = _.where(data, {"_type": type, "_tier": "view" });
			
		}

	});

});