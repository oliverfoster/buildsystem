define(['app/base/js/base', 'app/base/js/doc'], function(base, doc) {	
	
	base.on("document:started", setupWrapper);
	base.on("document:add", addMapToDocument);
	base.on("document:new document:clear", removeViewInstancesFromDocument);
	base.on("document:remove", removeViewInstanceOrMapFromDocument);
	base.on("document:removed", removeDropzoneFromViewInstance);

	var documentViewInstances = doc.views = {};

	var roots = doc.roots = {};

	function setupWrapper() {
		$('#wrapper').replaceWith(doc.templates.dataMapView.wrapper({},{}));
	}

	function addMapToDocument (map, parentView, dropzoneType) {

		var instance = createViewInstance(map, parentView);

		if (parentView == "#wrapper") setDocumentTitle(instance);

		documentViewInstances[instance.model.map._id] = instance;

		base.trigger("document:adding", instance);

		instance.draw();

		instance.trigger("dropzones:rendering");
		base.trigger("behaviour:dropzones:rendering", instance);

		createViewInstanceDropzones(instance);

		instance.trigger("dropzones:rendered");
		base.trigger("behaviour:dropzones:rendered", instance);

		instance.delegateEvents();

		if (typeof parentView === "string") {

			roots[instance.model.map._id] = instance;

			$(parentView).append(instance.$el);

		} else {

			if (!parentView.dropzones[dropzoneType]) parentView.dropzones[dropzoneType] = {};
			parentView.dropzones[dropzoneType][instance.model.map._id] = instance;
			
			var container = parentView.$("#"+dropzoneType+".dropzone");
			if (container.length === 0) {
				console.log("No dropzone found at map '" + parentView.model.map._id + "' called '" + dropzoneType + "' for '" + instance.model.map._id + "'");
			} else container.append(instance.$el);

		}

		base.trigger("document:added", instance);

		function setDocumentTitle(instance) {
			var data = instance.model;
			if (data && data._language && data._language.title) {
				document.title = data._language.title;
				base.trigger("document:title", data._language.title);
			}
		}

		function createViewInstance(map, parentView) {
			var view, data, config, behaviourConstructor;

			view = base.view._byId[map._viewId];
			if (map._dataId !== undefined) data = base.data._byId[map._dataId];

			if (view === undefined) return console.log("No view found at: " + map._viewId);	
			if (map._dataId !== undefined && data === undefined) return console.log("No data found at: " + map._dataId);

			config = base.config;

			behaviourConstructor = doc.behaviours[view._behaviour];

			if (behaviourConstructor === undefined) return console.log("No behaviour found at: " + view._behaviour);

			var instance = new behaviourConstructor({
				model: new Stemo({
					map: map,
					view: view.json,
					data: (data ? data.json : undefined),
					config: config.json,
					window: window,
					doc: doc
				}),
				dropzones: {},
				parent: parentView
			});

			return instance;
		}

		function createViewInstanceDropzones(view) {

			var data = view.model.json;

			for (var dropzoneType in data.map._dropzones) {
				
				for (var i = 0, l = data.map._dropzones[dropzoneType].length; i < l; i++) {
					var id = data.map._dropzones[dropzoneType][i];

					var map;
					if (typeof id === "string") {
						map = base.map._byId[id];

						if (map === undefined ) {
							console.log("Map id not found: " + id );
							return;
						}

						map = map.json;
						
					} else if (typeof id === "object") {
						map = id;
					}

					if (map._tier !== "map") {
						console.log("Id found, not a map: " + id );
						return;
					}

					base.trigger("document:add", map, view, dropzoneType);

				}

			}

		}
	}

	

	function removeViewInstancesFromDocument () {
		var i, l;

		for (var key in roots) {
			base.trigger("document:remove", roots[key]);
			delete roots[key];
		}

		var keys = _.keys(documentViewInstances);
		for (i = keys.length - 1, l = -1; i > l; i--) {
			base.trigger("document:remove", documentViewInstances[keys[i]]);
		}
		base.trigger("document:removedAll");
	}

	function removeViewInstanceOrMapFromDocument (viewOrMap, dropzoneType) {
		var view;
		if (viewOrMap.model) view = viewOrMap;
		else view = doc.views[viewOrMap._id];

		if (documentViewInstances[view.model.map._id]) {
			delete documentViewInstances[view.model.map._id];

			destroyViewInstanceDropzones(view, dropzoneType);

			view.remove();

			base.trigger("document:removed", view, dropzoneType);

			return;
		}

		function destroyViewInstanceDropzones(view, dropzoneType) {
			var dropzones;
			var keys;
			var i;
			if (!dropzoneType) {
				for (dropzoneType in view.dropzones) {
					dropzones = view.dropzones[dropzoneType];
					keys = _.keys(dropzones);
					for (i = keys.length - 1, l = -1; i > l; i--) {
						base.trigger("document:remove", dropzones[keys[i]], dropzoneType);
					}
				}
			} else {
				dropzones = view.dropzones[dropzoneType];
				keys = _.keys(dropzones);
				for (i = keys.length - 1, l = -1; i > l; i--) {
					base.trigger("document:remove", dropzones[keys[i]], dropzoneType);
				}
			}
		}
	}

	function removeDropzoneFromViewInstance(dropzoneView, dropzoneType) {
		if (!dropzoneView.parent) return;
		if (!dropzoneType) {
			for (dropzoneType in dropzoneView.parent.dropzones) {
				if (dropzoneView.parent.dropzones[dropzoneType][dropzoneView.model.map._id]) {
					delete dropzoneView.parent.dropzones[dropzoneType][dropzoneView.model.map._id];
					delete dropzoneView.parent;
					return;
				}
			}
		} else {
			if (dropzoneView.parent.dropzones[dropzoneType][dropzoneView.model.map._id]) {
				delete dropzoneView.parent.dropzones[dropzoneType][dropzoneView.model.map._id];
				delete dropzoneView.parent;
				return;
			}
		}
	}

});