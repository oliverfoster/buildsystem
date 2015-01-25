define(['app/structures/dataMapView/js/datamapview.document'], function() {

	base.once("data:ready", setupLoading);

	var $body = $("body");
	var loadingMap;
	var loadingData;

	function setupLoading() {
		loadingMap = base.map._byId.loading;
		loadingData = base.data._byId.loading;
		if (loadingMap === undefined || loadingData === undefined) return;
		loadingMap = loadingMap.json;
		loadingData = loadingData.json;

		base.on("document:new", showLoading);
		base.on("document:ready", hideLoading);
	}

	function showLoading() {
		base.trigger("document:add", loadingMap, "#postwrapper");
	}

	function hideLoading() {
		if (loadingData._animation) {
			var animation = loadingData._animation;
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