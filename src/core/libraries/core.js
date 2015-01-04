var core = window.core || {};

var stemo = new Stemo(core, "core");
window.core = stemo;

window.core.on("change:loaded.javascript change:loaded.templates", function(event) {
	if (window.core.loaded.javascript && window.core.loaded.templates) window.core.ready = true;
}).once("change:ready", function(event) {
	console.log("CORE: ready")
}).on("add:data.buffer", function(event){
	console.log("CORE: data added");
}).extend({
	loaded: {
		javascript: false,
		templates: false,
	},
	data: {
		buffer: []
	},
	ready: false
})