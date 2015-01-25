var buildsystem = window.buildsystem || {};
window.buildsystem = new Stemo(buildsystem, "buildsystem");;

var defaultCoreValues = {
	loaded: {
		javascript: false,
		templates: false,
		data: 0
	},
	data: {
		buffer: [],
		push: function(json) {
	        buildsystem.loaded.data++;
	        buildsystem.data.buffer.push(json);
	    }
	},
	ready: false
};

window.buildsystem
.on("change:loaded.javascript change:loaded.templates", checkAllLoaded)
.once("change:ready", coreReadyNotice)
.on("add:data.buffer", dataAddedNotice)
.extend(defaultCoreValues);

function checkAllLoaded(event) {
	if (window.buildsystem.loaded.javascript && window.buildsystem.loaded.templates) window.buildsystem.ready = true;
}

function coreReadyNotice(event) {
	console.log("BUILDSYSTEM: ready")
}

function dataAddedNotice(event) {
	console.log("BUILDSYSTEM: data added");
}

