view {
	[
		{
			"_id": "",
			"_type": "",
			"_tier": "view",
			"_behaviour": "",
			"_template": "",
			"_tagName": "",
			"_classes": ""
		}
	]
}

map {
	[
		{
			"_id": "",
			"_type": "",
			"_tier": "map",
			"_classes": ""
			"_choice": [
				{
					"_where": {
						"global.property.path" : [ values ]
					},
					"_dataId": "data._id",
					"_viewId": "view._id",
					"_dropzones": {
						"dropzoneId": [
							map._id
						]
					}
				}
			],
			"_dynamic": boolean
		},
		{
			"_id": "",
			"_type": "",
			"_tier": "map",
			"_classes": ""
			"_dataId": "data._id",
			"_viewId": "view._id",
			"_dropzones": {
				"dropzoneId": [
					map._id
				]
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

base.behaviours["PageMenuComponent"] {

}