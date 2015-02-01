define(['app/base/js/base', 'app/base/js/doc'], function(base, doc){
	
	setupInputBuffer();
	setupDevToggle();

	var $html = $('html');

	function setupDevToggle() {
		base.on("inputbuffer", function(keyInputBuffer) {
			if (compareEnd(keyInputBuffer, 'devdev')) {
				toggleDev();
			}
		});
	}

	function setupInputBuffer() {
		var keyInputBuffer = "";
		$(window).on("keyup", function(event) {
			keyInputBuffer += String.fromCharCode(event.which);
			if (keyInputBuffer.length > 100) keyInputBuffer = keyInputBuffer.substr(1);
			base.trigger("inputbuffer", keyInputBuffer);
		});
	}

	function compareEnd(buffer, word) {
		if (buffer.substr( buffer.length - word.length ).toLowerCase() == word.toLowerCase()) return true;
		return false;
	}

	var body;

	function toggleDev() {
		if ($html.is(".dev")) disableDev();
		else enableDev();
	}

	function enableDev() {
		$html.addClass("dev");
		body = $("#datamapview-dev");
		renderDev();
	}

	function disableDev() {
		$html.removeClass("dev");
		body.html("");
	}

	function renderDev() {
		var outerDev = doc.templates['dev-outer'];
		body.append( outerDev({},{}) );
	}

});