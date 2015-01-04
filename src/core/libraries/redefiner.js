//allows a module to be refined
(function() {
	if (window.define.old) return;
	var olddefine = define;
	window.define = function() {
		requirejs.undef(arguments[0]);
		return define.old.apply(this, arguments);
	}
	define.old = olddefine;
	define.prototype = olddefine.prototype;
	define.amd = olddefine.amd;
})();