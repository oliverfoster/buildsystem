define(['app/base/js/base', 'app/base/js/router'], function(base) {

	base.on("router:route:app", function() {
		
		switch ( arguments[0] ) {
		case "id":
			//do something with the reset of the arguments
		}

	});

	base.on("router:route:dev", function() {
		
		switch ( arguments[0] ) {
		case "id":
			//do something with the reset of the arguments
		}
		
	});

});