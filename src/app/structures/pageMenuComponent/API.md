view {
	[
		{
			"_id": "",
			"_type": "",
			"_tier": "view",
			"_behaviour": "",
			"_template": "",
			"_tagName": ""
		}
	]
}

map {
	[
		{
			"_id": "",
			"_type": "",
			"_tier": "map",
			"_choice": [
				{
					"_where": {
						"global.property.path" : [ values ]
					},
					"_data": "data._id",
					"_view": "view._id",
					"_children": {
						"type": [
							map._id
						],
					}
				}
			],
			"_dynamic": boolean
		},
		{
			"_id": "",
			"_type": "",
			"_tier": "map",
			"_data": "data._id",
			"_view": "view._id",
			"_children": {
				"type": [
					map._id
				],
			}
		}
	]
}

data {
	[
		{
			"_id": "",
			"_type": "",
			"_tier": "data",
			"title": "",
			"body": ""
		}
	]
}

base.behaviour.get("PageMenuComponent") {

}