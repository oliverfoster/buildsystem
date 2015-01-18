define(['app/base/js/document'], function() {	
	
	base.on("document:add", addMapToDocument);
	base.on("document:new document:clear", removeViewInstancesFromDocument);
	base.on("document:remove", removeViewInstanceFromDocument);
	base.on("document:removed", removeChildFromViewInstance);

	base.document = { root: undefined };

	var documentViewInstances = base.document.views = {};

	function addMapToDocument (map, parentView, childType) {
		var instance = createViewInstance(map, parentView);

		documentViewInstances[instance.cid] = instance;

		instance.draw();

		createViewInstanceChildren(instance);

		instance.delegateEvents();

		if (!parentView) {

			base.document.root = instance;

			base.$wrapper.append(instance.$el);
		} else {

			if (!parentView.children[childType]) parentView.children[childType] = {};
			parentView.children[childType][instance.cid] = instance;
			
			var container = parentView.$("#"+childType+".children");
			if (container.length === 0) parentView.$el.append(instance.$el);
			else container.append(instance.$el);

		}

		base.trigger("document:added", instance);
	}

	function createViewInstance(map, parentView) {
		var view, data, config, behaviourConstructor;

		view = base.view._byId[map._view];
		data = base.data._byId[map._data];

		if (view === undefined) return console.log("No view found at: " + map._view);	
		if (view === undefined) return console.log("No data found at: " + map._data);

		config = base.config;

		behaviourConstructor = base.behaviour.get(view._behaviour);

		if (behaviourConstructor === undefined) return console.log("No behaviour found at: " + view._behaviour);

		var instance = new behaviourConstructor({
			model: new Stemo({
				map: map,
				view: view.json,
				data: data.json,
				config: config.json
			}),
			children: {},
			parent: parentView
		});

		return instance;
	}


	function createViewInstanceChildren(view) {

		var data = view.model.json;

		for (var childType in data.map._children) {
			
			for (var i = 0; i < data.map._children[childType].length; i++) {
				var id = data.map._children[childType][i];

				var map = base.map._byId[id];

				if (map === undefined ) {
					console.log("Map id not found: " + id );
					return;
				}

				if (map._tier !== "map") {
					console.log("Id found, not a map: " + id );
					return;
				}

				base.trigger("document:add", map, view, childType);

			}

		}

	}

	function removeViewInstancesFromDocument () {
		if (base.document.root) base.trigger("document:remove", base.document.root);
		var keys = _.keys(documentViewInstances);
		for (var i = keys.length - 1; i > -1; i--) {
			base.trigger("document:remove", documentViewInstances[keys[i]]);
		}
		base.trigger("document:removedAll");
	}

	function removeViewInstanceFromDocument (view, childType) {
		if (documentViewInstances[view.cid]) {
			delete documentViewInstances[view.cid];

			destroyViewInstanceChildren(view, childType);

			view.remove();

			base.trigger("document:removed", view, childType);

			return;
		}
	}

	function destroyViewInstanceChildren(view, childType) {
		var children;
		var keys;
		var i;
		if (!childType) {
			for (childType in view.children) {
				children = view.children[childType];
				keys = _.keys(children);
				for (i = keys.length - 1; i > -1; i--) {
					base.trigger("document:remove", children[keys[i]], childType);
				}
			}
		} else {
			children = view.children[childType];
			keys = _.keys(children);
			for (i = keys.length - 1; i > -1; i--) {
				base.trigger("document:remove", children[keys[i]], childType);
			}
		}
	}

	function removeChildFromViewInstance(childView, childType) {
		if (!childView.parent) return;
		if (!childType) {
			for (childType in childView.parent.children) {
				if (childView.parent.children[childType][childView.cid]) {
					delete childView.parent.children[childType][childView.cid];
					delete childView.parent;
					return;
				}
			}
		} else {
			if (childView.parent.children[childType][childView.cid]) {
				delete childView.parent.children[childType][childView.cid];
				delete childView.parent;
				return;
			}
		}
	}

});