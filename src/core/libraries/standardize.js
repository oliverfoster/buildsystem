if (Number.MAX_SAFE_INTEGER === undefined) Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
if (Number.MIN_SAFE_INTEGER === undefined) Number.MIN_SAFE_INTEGER = -(Math.pow(2, 53) - 1);

if (Number.prototype.roundTo === undefined && Number.roundTo === undefined) {
	Number.prototype.roundTo = function roundTo( places) {
	    return +(Math.round(this + ("e+"+places))  + ("e-"+places));
	};
}

if (Array.prototype.indexOf === undefined) {
	Array.prototype.indexOf = function(value) {
		for (var i = 0, l = this.length; i < l; i++ ) {
			if (this[i] === value) return i;
		}
		return -1;
	}
}

if (String.prototype.indexOf === undefined) {
	String.prototype.indexOf = function(value) {
		for (var i = 0, l = this.length; i < l; i++ ) {
			if (this[i] === value) return i;
		}
		return -1;
	}
}

if (window.defer === undefined && window.delay === undefined) {
	window.defer = function(func, that, args, callback) {
		delay(func, that, 1, args, callback);
	};
	window.delay = function(func, that, timeout, args, callback) {
		that = that === undefined ? this : that;
		args = args === undefined ? [] : args;
		setTimeout(function() {
			func.apply(that, args);
			if (typeof callback === "function") callback();
		}, timeout);
	};
}