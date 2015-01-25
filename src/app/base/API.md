##CLIENT ENVIRONMENT

	base {

		size : "extrasmall"/"small"/"normal"/"large"/"extralarge"
		ratio : "extralong"/"long"/"portrait"/"landscape"/"wide"/"extrawide" 

		view
		map
		data
		config

	}

	document.templates
	document.views
	document.behaviours

##CONFIG

	router {
		
		{
			"start": {
				"delay": milliseconds,
				"map": "",
				"force": boolean
			}
		}

	}

##DEFAULT BEHAVIOUR CLASS

	base.behaviours["Default"] = {

		_isRendered: boolean
		_isPreparedDOM: boolean
		_template: "placeholder"
		attributes()
		id()
		className()
		tagName()
		_preparedDOM()
		initialize()
		_construct()
		draw()
		undelegateEvents()
		events()
		delegateEvents()
		_preRender()
		render()
		_render()
		_postRender()
		remove()
		_remove()

	}.extend({

		_template: ""
		_preparedDOM: function() {
			return {
				_attributes: {
					"name": "value"
				},
				_id: "",
				_classes: "",
				_tagName: "",
				_events: {

				}
			};
		}
		_construct()
		_preRender()
		_render()
		_postRender()
		_remove()

	})