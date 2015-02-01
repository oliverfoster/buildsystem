define(['app/base/js/base', 'app/structures/dataMapView/js/datamapview.doc'], function(base) {

	base.once("data:processed", setupLoading);
	base.on("loading:show", showLoading);
	base.on("loading:hide", hideLoading);

	var $body = $("body");
	var loadingMap;

	function setupLoading() {
		loadingMap = base.map._byId.loading;
		if (loadingMap === undefined) return;
		loadingMap = loadingMap.json;

		base.on("document:new", showLoading);
		base.on("document:ready", hideLoading);
	}

	function showLoading(options) {
		if (options && options._animate === false) return;
		base.trigger("document:add", loadingMap, "#postwrapper");
	}

	function hideLoading() {
		if (loadingMap._animation) {
			var animation = loadingMap._animation;
			if (animation instanceof Array) {
				for (var i = 0, l = animation.length; i < l; i++) {
					if (i == l - 1) animation[i].options.complete = removeLoading;
					$("#loading").velocity(animation[i].type, animation[i].options);
				}
			} else {
				animation.options.complete = removeLoading;
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