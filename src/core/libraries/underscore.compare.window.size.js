define(function() {

	var windowDimesions = {
			height: $(window).height(),
			width: $(window).width()
		};

	var windowRatio = Math.floor(windowDimesions.width/windowDimesions.height*100)/100;

	var deviceSizes = [
		{
			"size": "extrasmall",
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
			"size": "small",
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
				"min": 0.78,
				"max": 0.9999
			}
		},
		{
			"ratio": "landscape",
			"_range": {
				"min": 1,
				"max": 1.3398
			}
		},
		{
			"ratio": "wide",
			"_range": {
				"min": 1.3399,
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


	var $html = $("html");

	function resize() {
		windowDimesions = {
			height: $(window).height(),
			width: $(window).width()
		};

		windowRatio = Math.floor(windowDimesions.width/windowDimesions.height*100)/100;

		for (var i = 0, l = deviceSizes.length; i < l; i++) {
			deviceSizes[i]._where.height._range.min = deviceSizes[i]._where.width._range.min / windowRatio;
			deviceSizes[i]._where.height._range.max = deviceSizes[i]._where.width._range.max / windowRatio;
		}

		var size = _.compare.where(windowDimesions, deviceSizes);
		var ratio = _.compare.range(windowRatio, deviceRatios, {roundTo: 4});

		var device = {};
		device = _.extend(device, size);
		device = _.extend(device, ratio);

		$html.removeClass("extrasmall small normal large extralarge");
		$html.removeClass("extralong long portrait landscape wide extrawide");
		$html.addClass(device.size);
		$html.addClass(device.ratio);

		_.extend(window, device);

	}
	
	$(window).resize(resize);
	resize();

});