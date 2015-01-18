define(['app/base/js/data'], function() {	
	
	base.once("data:ready", function() {

		var data = base.data;

		base.data = { _flat : _.where(data, {"_tier": "data" }) };
		base.data._byId = _.indexBy( base.data._flat, "_id" );
		base.data._types = _.uniq(_.pluck( base.data._flat, "_type"));
		_.extend(base.data, _.groupBy( base.data._flat, "_type" ) );
		base.data._duplicates = _.filter( _.pairs( _.countBy( base.data._flat, "_id") ) , function(item, index) { return item[1] > 1; });
		if ( base.data._duplicates.length > 0 ) {
			console.log("Data tier has multiple identical ids: " + base.data._duplicates[0][0]);
		} else delete base.data._duplicates;

		base.map = { _flat : _.where(data, {"_tier": "map" }) };
		base.map._byId = _.indexBy( base.map._flat, "_id" );
		base.map._types = _.uniq(_.pluck( base.map._flat, "_type"));
		_.extend(base.map, _.groupBy( base.map._flat, "_type" ) );
		base.map._duplicates = _.filter( _.pairs( _.countBy( base.map._flat, "_id") ) , function(item, index) { return item[1] > 1; });
		if ( base.map._duplicates.length > 0 ) {
			console.log("Map tier has multiple identical ids: " + base.map._duplicates[0][0]);
		} else delete base.map._duplicates;

		base.view = { _flat : _.where(data, {"_tier": "view" }) };
		base.view._byId = _.indexBy( base.view._flat, "_id" );
		base.view._types = _.uniq(_.pluck( base.view._flat, "_type"));
		_.extend(base.view, _.groupBy( base.view._flat, "_type" ) );
		base.view._duplicates = _.filter( _.pairs( _.countBy( base.view._flat, "_id") ) , function(item, index) { return item[1] > 1; });
		if ( base.view._duplicates.length > 0 ) {
			console.log("View tier has multiple identical ids: " + base.view._duplicates[0][0]);
		} else delete base.view._duplicates;

	});

});