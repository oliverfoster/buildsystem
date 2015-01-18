var core = window.core || {};
window.core = new Stemo(core, "core");;

var defaultCoreValues = {
	loaded: {
		javascript: false,
		templates: false,
		data: 0
	},
	data: {
		buffer: [],
		push: function(json) {
	        core.loaded.data++;
	        core.data.buffer.push(json);
	    }
	},
	ready: false
};

window.core
.on("change:loaded.javascript change:loaded.templates", checkAllLoaded)
.once("change:ready", coreReadyNotice)
.on("add:data.buffer", dataAddedNotice)
.extend(defaultCoreValues);


function checkAllLoaded(event) {
	if (window.core.loaded.javascript && window.core.loaded.templates) window.core.ready = true;
}

function coreReadyNotice(event) {
	console.log("CORE: ready")
}

function dataAddedNotice(event) {
	console.log("CORE: data added");
}