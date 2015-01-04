define(function() {

	var windowDimesions = {
			height: $(window).height(),
			width: $(window).width()
		};

	var windowRatio = Math.floor(windowDimesions.width/windowDimesions.height*100)/100;

	var deviceSizes = [
		{
			"size": "small",
			"_where": {
				"height": {
					"_range": {
						"min": 320 / windowRatio,
						"max": 520 / windowRatio
					}
				},
				"width": {
					"_range": {
						"min": 320,
						"max": 520
					}
				}
			}
		},
		{
			"size": "medium",
			"_where": {
				"height": {
					"_range": {
						"min": 520 / windowRatio,
						"max": 760 / windowRatio
					}
				},
				"width": {
					"_range": {
						"min": 520,
						"max": 760
					}
				}
			}
		},
		{
			"size": "normal",
			"_where": {
				"height": {
					"_range": {
						"min": 760 / windowRatio,
						"max": 1024 / windowRatio
					}
				},
				"width": {
					"_range": {
						"min": 760,
						"max": 1024
					}
				}
			}
		},
		{
			"size": "large",
			"_where": {
				"height": {
					"_range": {
						"min": 1024 / windowRatio,
						"max": 1600 / windowRatio
					}
				},
				"width": {
					"_range": {
						"min": 1024,
						"max": 1600
					}
				}
			}
		},
		{
			"size": "extralarge",
			"_where": {
				"height": {
					"_range": {
						"min": 1600 / windowRatio,
						"max": Number.MAX_SAFE_INTEGER
					}
				},
				"width": {
					"_range": {
						"min": 1600,
						"max": Number.MAX_SAFE_INTEGER
					}
				}
			}
		}
	];

	var deviceRatios = [
		{
			"ratio": "extralongscreen",
			"_range": {
				"min": 0,
				"max": 0.5624
			}
		},
		{
			"ratio": "longscreen",
			"_range": {
				"min": 0.5625,
				"max": 0.7799
			}
		},
		{
			"ratio": "portrait",
			"_range": {
				"min": 0.78,
				"max": 0.9999
			}
		},
		{
			"ratio": "landscape",
			"_range": {
				"min": 1,
				"max": 1.33
			}
		},
		{
			"ratio": "widescreen",
			"_range": {
				"min": 1.3399,
				"max": 1.6
			}
		},
		{
			"ratio": "extrawidescreen",
			"_range": {
				"min": 1.6999,
				"max": Number.MAX_SAFE_INTEGER
			}
		}
	];


	function resize() {
		windowDimesions = {
			height: $(window).height(),
			width: $(window).width()
		};

		windowRatio = Math.floor(windowDimesions.width/windowDimesions.height*100)/100;

		for (var i = 0; i < deviceSizes.length; i++) {
			deviceSizes[i]._where.height._range.min = deviceSizes[i]._where.width._range.min / windowRatio;
			deviceSizes[i]._where.height._range.max = deviceSizes[i]._where.width._range.max / windowRatio;
		}

		var size = compare.where(windowDimesions, deviceSizes);
		var ratio = compare.range(windowRatio, deviceRatios, {roundTo: 4});

		var device = {};
		device = _.extend(device, size);
		device = _.extend(device, ratio);


		if (window.core === undefined)window.core = {};
		if (window.core.device === undefined) window.core.device = {};
		_.extend(window.core.device, device);

	}
	$(window).resize(resize);
	resize();

});