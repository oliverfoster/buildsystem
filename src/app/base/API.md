base {

	$html
	$wrapper

	behaviour {
		get()
		set/register()
	}

}

router {
	
	{
		"start": {
			"delay": milliseconds,
			"map": "",
			"force": boolean
		}
	}

}

base.behaviour.get("Default") {

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