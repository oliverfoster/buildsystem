define(["./base"], function() {

	base.on("change:config.themes change:config.themes.current", loadTheme);
	base.on("data:ready", loadTheme);

	var theme = {};

	var $html = $("html");
	var $body = $("body");
	function loadTheme() {
		if (theme.layout) $body.removeClass(theme.layout);

		var themeName = base.config.themes.current || base.config.themes.default || "vanilla";

		theme.layout = [ 
			"layout", 
			"layout-" + themeName, 
			"color-" + themeName, 
			"size-" + themeName,
			"font-" + themeName,
		].join(" ");
				
		if (theme.layout) $body.addClass(theme.layout);
		
	}
	

});