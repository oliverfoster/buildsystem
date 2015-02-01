Handlebars.registerHelper("htmlattrjson", function(value, context) {

	if (value === undefined) return "";

	var repl = /\"/g;
	var str = JSON.stringify(value);
	str = str.replace(repl, "'");

	return str;

});