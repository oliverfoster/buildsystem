define(['app/base/js/data'], function() {	
	
	base.once("data:ready", convertToPageMenuComponentData);

	function convertToPageMenuComponentData() {
		
		var data = base.data.json;

		var tiers = {
			"schema": {
				"mergeDuplicates": true,
				"applyExtends": true
			},
			"data": {
				"applyDefaults": true
			},
			"map": {
				"applyDefaults": true
			},
			"view": {
				"applyDefaults": true
			}
		};
		var defaultsTier = "schema";

		var tierNames = _.keys(tiers);

		var raw = {};

		for (var i = 0, l = tierNames.length; i < l; i++) {
			var tier = tierNames[i];
			var rawItem = raw[tier] = { _flat : _.where(data, {"_tier": tier }) };

			manageDuplicates(tier, rawItem);

			manageDefaults(tier, rawItem);
		
			rawItem._byId = _.indexBy( rawItem._flat, "_id" );

			manageExtends(tier, rawItem);			

			rawItem._types = _.uniq(_.pluck( rawItem._flat, "_type"));
						
		}

		function manageDuplicates(tier, item) {
			item._duplicates = _.filter( _.pairs( _.countBy( item._flat, "_id") ) , duplicateFilter);

			if ( item._duplicates.length > 0 ) {
				if (tiers[tier].mergeDuplicates) {
					for (var j = 0, lj = item._duplicates.length; j < lj; j++) {

						item._flat = mergeDuplicates(item._flat, { 
							_id: item._duplicates[j][0] 
						});

					}
					delete item._duplicates;
				} else {
					console.log(sections[i] + " tier has multiple identical ids: " + item._duplicates[0][0]);
				}
			} else delete item._duplicates;

			function duplicateFilter(item) { return item[1] > 1; }

			function mergeDuplicates(list, where) {

				var duplicates = _.where(list, where);
				var nondups = _.reject(list, function(item) {
					return _.where([item], where).length > 0;
				});

				var output = {};

				for (var i = 0, l = duplicates.length; i < l; i++) {
					output = $.extend(true, output, duplicates[i]);
				}

				nondups.push(output);

				return nondups;

			}

		}

		function manageExtends(tier, item) {
			
			if (tiers[tier].applyExtends) applyExtends(item);


			function extendsFilter(item) { return item._extends !== undefined; }

			function replaceExtends(list, where, withItem) {
				var output = _.reject(list, function(item) {
					return _.where([item], where).length > 0;
				});
				output.push(withItem);
				return output;
			}

			function applyExtends(item) {
				item._extends = _.filter( item._flat, extendsFilter);

				for (var i = 0, l = item._extends.length; i < l; i++) {
					var output = {};
					var obj = item._extends[i];
					for (var k in obj._extends) {
						var from = item._byId[k];
						output = $.extend(true, output, from, obj, obj._extends[k]);
						output._attributes = $.extend(output._attributes, obj._extends[k]._attributes);
					}

					item._flat = replaceExtends(item._flat, { _id: output._id }, output);
					item._byId[output._id] = output;

					delete output._extends;
				}

				delete item._extends;
			}
		}

		function manageDefaults(tier, item) {
			if (tiers[tier].applyDefaults) applyDefaults(tier, item);


			function applyDefaults(tier, item) {
				var defaults = createDefaults(tier);

				for (var i = 0, l = item._flat.length; i < l; i++) {
					item._flat[i] = $.extend(true, {}, defaults, item._flat[i]);
				}
			}

			function createDefaults(tier) {
				var schema = raw[defaultsTier]._byId[tier];

				var defaults = {};

				for (var attr in schema._attributes) {
					if (schema._attributes[attr]._default !== undefined) {
						defaults[attr] = schema._attributes[attr]._default;
					}
				}

				return defaults;
			}

		}


		_.extend(base, raw);
		base.sync("push");

	}

});