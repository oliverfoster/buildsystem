define(['app/base/js/base', 'app/structures/dataMapView/js/datamapview.doc'], function(base, doc) {

	base.on("document:new", newDocument);
	base.on("document:adding", setupReadyListener);
	base.on("router:routed:app:id", checkReady);
	
	var waitingForViews = 0;

	function newDocument() {
		waitingForViews = 0;
	}

	function setupReadyListener(instance) {
		instance.listenToOnce(instance, instance.model.view._ready._on, setReady);
		waitingForViews++;
	}

	function setReady() {
		this.model.view._ready._complete = true;
		waitingForViews--;
	}

	function checkReady() {
		if (waitingForViews === 0) {
			base.trigger("document:ready");
		}
	}

});