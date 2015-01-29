define(['app/structures/dataMapView/js/datamapview.document'], function() {

	base.once("data:ready", setupLoading);

	var $body = $("body");
	var loadingMap;

	function setupLoading() {
		loadingMap = base.map._byId.loading;
		if (loadingMap === undefined) return;
		loadingMap = loadingMap.json;

		base.on("document:new", showLoading);
		base.on("document:ready", hideLoading);
	}

	function showLoading() {
		base.trigger("document:add", loadingMap, "#postwrapper");
	}

	function hideLoading() {
		if (loadingMap._animation) {
			var animation = loadingMap._animation;
			if (animation instanceof Array) {
				for (var i = 0, l = animation.length; i < l; i++) {
					$("#loading").velocity(animation[i].type, animation[i].options);
				}
			} else {
				$("#loading").velocity(animation.type, animation.options);
			}
		} else {
			$("#loading").fadeOut("fast", removeLoading);
		}
	}

	function removeLoading() {
		base.trigger("document:remove", loadingMap);
	}

});