(function() {
	function isArray(obj) {
		 if (obj instanceof Array || (obj.length !== undefined && typeof obj == "object")) return true;
		 return false;
	}

	function getter(on, path) {
	    var o = on;
	    path = path.replace(/\[(\w+)\]/g, '.$1');
	    path = path.replace(/^\./, '');
	    var a = path.split('.');
	    while (a.length) {
	        var n = a.shift();
	        if (typeof o === "object" && n in o) {
	            o = o[n];
	        } else {
	            return;
	        }
	    }
	    return o;
	}

	var literalComparitor = function(value, rule, options) {
		if (isArray(rule)) {
			for (var i = 0; i < rule.length; i++) {
				if (value == rule[i]) return true;
			}
		} else {
			if (value == rule) return true;
		}
		return false;
	};

	var rangeComparitor = function(value, rule, options) {
		if (rule._range === undefined) return false;
		if (rule._range.min === undefined) return false;
		if (rule._range.max === undefined) return false;
		options = options || {};
		if (options.roundTo) {
			value = value.roundTo(2);
		}
		if (value < rule._range.min || value > rule._range.max) return false;
		return true;
	};

	var whereComparitor = function(obj, rule, options) {
		if (rule._where === undefined) return false;
		var opts = _.extend({}, options);
		delete opts.comparitor;
		if (isArray(rule)) {
			for (var i = 0; i < rule._where.length; i++) {
				for (var rk in rule._where[i]) {
					var value;
					if (rk.indexOf(".") === -1) value = obj[rk];
					else value = getter(obj,rk);
					if (value === undefined) return false;

					var crule = rule._where[i][rk];
					if ( !isArray(crule) && typeof crule == "object") crule = [ crule ];
					else {
						crule = crule;
						opts.comparitor = "literal";
					}

					if (!compare( value, crule, opts)) return false;
				}
			}
		} else {
			for (var rk in rule._where) {
				var value;
				if (rk.indexOf(".") === -1) value = obj[rk];
				else value = getter(obj,rk);
				if (value === undefined) return false;

				var crule = rule._where[rk];
				if (!isArray(crule) && typeof crule == "object") crule = [ crule ];
				else {
					crule = crule;
					opts.comparitor = "literal";
				}

				if (!compare( value, crule, opts)) return false;
			}
		}
		return true;
	};

	var comparitorMap = {
		where: whereComparitor,
		range: rangeComparitor,
		literal: literalComparitor
	};
	var comparitorTagMap = {
		_where: whereComparitor,
		_range: rangeComparitor,
		_literal: literalComparitor
	};
	var comparitorKeys = _.keys(comparitorTagMap)




	var compare = function(obj, rules, options) {
		options = options || {};
		var rtn = [];
		if (options.comparitor) {
			if (comparitorMap[options.comparitor] === undefined) throw "No such comparitor " + options.comparitor;
			var rtn = [];
			for (var i = 0; i < rules.length; i++) {
				var rule = rules[i];
				if (comparitorMap[options.comparitor](obj, rule, options)) {
					var clone = _.extend({}, rule);
					//delete clone["_"+options.comparitor];
					rtn.push(clone);
					if (!options.greedy) return rtn[0];
				}
			}
		} else {
			for (var i = 0; i < rules.length; i++) {
				var rule = rules[i];
				var ruleKeys = _.keys(rule);
				var comparitors = _.intersection(comparitorKeys, ruleKeys);

				var matches = 0;
				for (var c = 0; c < comparitors.length; c++) {
					var comp = comparitors[c];
					if ( comparitorTagMap[comp](obj, rule, options) ) matches++;
				}
				if (matches === comparitors.length) {
					var clone = _.extend({}, rule);
					for (var c = 0; c < comparitors.length; c++) {
						var comp = comparitors[c];
						//delete clone[comp];
					}
					rtn.push(clone);
					if (!options.greedy) return rtn[0];
				}
			}
		}
		return undefined;
	};
	compare.where = function where(obj, rules, options) {
		options = options || {};
		options.comparitor = "where";
		return compare(obj, rules, options);
	};
	compare.range = function range(value, rules, options) {
		options = options || {};
		options.comparitor = "range";
		return compare(value, rules, options);
	};
	compare.literal = function range(value, rules, options) {
		options = options || {};
		options.comparitor = "literal";
		return compare(value, rules, options);
	};

	window.compare = compare;
})();