define(function() {

	var deviceAreas = [
		{
			"size": "extrasmall",
			"_range": {
				"min": 0,
				"max": Math.pow(520, 2)
			}
		},
		{
			"size": "small",
			"_range": {
				"min": Math.pow(520, 2),
				"max": Math.pow(760, 2)
			}
		},
		{
			"size": "normal",
			"_range": {
				"min": Math.pow(760, 2),
				"max": Math.pow(1024, 2)
			}
		},
		{
			"size": "large",
			"_range": {
				"min": Math.pow(1024, 2),
				"max": Math.pow(1600, 2)
			}
		},
		{
			"size": "extralarge",
			"_range": {
				"min": Math.pow(1600, 2),
				"max": Number.MAX_SAFE_INTEGER
			}
		}
	];

	var deviceRatios = [
		{
			"ratio": "extralong",
			"_range": {
				"min": 0,
				"max": 0.5624
			}
		},
		{
			"ratio": "long",
			"_range": {
				"min": 0.5625,
				"max": 0.7799
			}
		},
		{
			"ratio": "portrait",
			"_range": {
				"min": 0.7800,
				"max": 0.9999
			}
		},
		{
			"ratio": "landscape",
			"_range": {
				"min": 1.0000,
				"max": 1.3399
			}
		},
		{
			"ratio": "wide",
			"_range": {
				"min": 1.3400,
				"max": 1.6998
			}
		},
		{
			"ratio": "extrawide",
			"_range": {
				"min": 1.6999,
				"max": Number.MAX_SAFE_INTEGER
			}
		}
	];


	function resize() {
		var windowDimesions = {
			height: $(window).height(),
			width: $(window).width()
		};

		var windowRatio = Math.floor(windowDimesions.width/windowDimesions.height*100)/100;
		var windowArea = windowDimesions.height * windowDimesions.width;

		var size = _.compare.range(windowArea, deviceAreas);
		var ratio = _.compare.range(windowRatio, deviceRatios, {roundTo: 3});

		var device = {};
		device = _.extend(device, size);
		device = _.extend(device, ratio);

		_.extend(window, device);

	}
	
	$(window).resize(resize);
	resize();

});