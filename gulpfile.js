var etc = require('etc'),
	Q = require('q'),
	fs = require('fs'),
	_ = require('underscore'),
	es = require('event-stream'),
	del = require('del'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	addsrc = require('gulp-add-src'),
	dir = require('node-dir'),
	foreach = require('gulp-foreach'),
	collate = require('gulp-collate'),
	deleted = require('gulp-deleted'),
	amdOptimize = require('amd-optimize'),
	gulpAmdOptimizer = require('gulp-amd-optimizer'),
	gutil = require('gulp-util'),
	tap = require('gulp-tap'),
	gwatch = require('gulp-watch'),//gulp.watch,
	concat = require('gulp-concat'),
	concatJSON = require('gulp-concat-json2'),
	changed = require('gulp-changed'),
	cache = require('gulp-cached'),
	filter = require('gulp-filter'),
	remember = require('gulp-remember'),
	notifier = require('node-notifier'),
	lessSM = require('gulp-less-sourcemap'),
	lessNSM = require('gulp-less'),
	jshint = require('gulp-jshint'),
	jsonminify = require('gulp-jsonminify'),
	jsonlint = require('gulp-json-lint'),
	sourcemaps = require('gulp-sourcemaps'),
	serveIndex = require('serve-index'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	handlebarsSM = require('gulp-handlebars'),
	wrap = require('gulp-wrap'),
	args   = require('yargs').argv,
	streamqueue  = require('streamqueue'),
	declare = require('gulp-declare'),
	htmltidy = require('gulp-htmltidy'),
	htmlhint = require("gulp-htmlhint"),
	File = require('vinyl');


process.umask(0);

var browserSync = require('browser-sync'),
	reload = browserSync.reload,
	browserSyncOn = false;


var conf = require('etc')().file( path.join(__dirname, 'gulpconfig.json') ).file( path.join(__dirname, 'package.json') ).toJSON();

/*TODO
*
* Need to be able to restrict dev to only one config folder
* gulp dev test
* gulp dev test2
*/


function expandPathVariables(arr, values) {
	var rtn = [];

	_.each(arr, function(item, index) {
		var matches = item.match(/{{.*?}}/g);
		matches = _.uniq(matches);
		for (var i = 0; i < matches.length; i++) {
			var match = matches[i].substr(2, matches[i].length - 4);
			item = item.replace( (new RegExp("{{"+match+"}}","g")), values[match] );
		}
		rtn.push(item);
	});

	return rtn;
}


function walkSync(dir, done) {
	var results = [];
	var list = fs.readdirSync(dir);
	var pending = list.length;
	if (!pending) return done(null, results);
	var red = 0;
	list.forEach(function(file) {
		var subdirpath = path.join(dir, file);
		var stat = fs.statSync(subdirpath);
		red++;
		if (stat && stat.isDirectory()) {
			results.push( subdirpath );
			if (red == pending) return done(null, results);
		}
	});
}

function walk(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		var red = 0;
		list.forEach(function(file) {
			var subdirpath = path.join(dir, file);
			fs.stat(subdirpath, function(err, stat) {
				red++;
        		if (stat && stat.isDirectory()) {
        			results.push( subdirpath );
        			if (red == pending) return done(null, results);
        		}
        	});
		});

	});
}


/*
* TASKS
*/
gulp.task('default', ['dev-watch'], function() {
	var index = serveIndex(conf.dest.path, {'icons': true})

	browserSyncOn = true;
    var srv = browserSync({
        server: {
            baseDir: conf.dest.path,
            middleware: function (req, res, next) {
            	if (req.url == "/")	index(req, res, next);
            	else next();
		    }
        },
        notify: false,
        ghostMode: {
		    clicks: true,
		    location: true,
		    forms: true,
		    scroll: true
		}
    });

});
gulp.task('build', [ 'cleanup-code', 'cleanup-and-copy-changed-assets' ], function() {
	gulp.start([ 
		'app-index',
		'app-handlebars',
		'app-javascript', 
		'app-less',
		"app-json",
		'core-javascript'
	], function() {
		gutil.log(gutil.colors.green("Production Build Complete."))
	});
});
gulp.task('dev', [ 'cleanup-code', 'cleanup-and-copy-changed-assets' ], function() {
	gulp.start([ 
		'app-index-dev', 
		'app-less-dev', 
		"app-javascript-dev", 
		"app-handlebars-dev",
		"app-json-dev",
		'core-javascript-dev'
	], function() {
		gutil.log(gutil.colors.green("Developer Build Complete."))
	});
});
gulp.task('dev-watch', [ 'cleanup-code', 'cleanup-and-copy-changed-assets-dev-watch' ], function() {
	gulp.start([ 
		'app-index-dev', 
		'app-less-dev-watch', 
		"app-javascript-dev-watch", 
		"app-handlebars-dev-watch",
		"app-json-dev-watch",
		'core-javascript-dev'
	], function() {
		gutil.log(gutil.colors.green("Developer Build Complete. Waiting for changes..."))
	});
});

/*
* CLEAN CODE
*/
gulp.task('cleanup-code', function() {
	var q = Q.defer();	
	var configPath = path.join(__dirname, conf.dest.path) + "/";
	walk(configPath, function(err, subdirs) {
		if (err) return;
	    _.each(subdirs, function(dir) {
			del.sync(conf.clean.paths, {cwd: dir });
		});
		return q.resolve();
	});
	return q.promise;
});
/*
* OVERWRITE CHANGED ASSETS
* DELETE FILES DELETED FROM SRC
*/
gulp.task('cleanup-and-copy-changed-assets-dev-watch', ['cleanup-and-copy-changed-assets'], function () {
  	var configPath = path.join(__dirname, conf.src.root, "configs");
  	var watchers = [];
	walk(configPath, function(err, subdirs) {
		if (err) return;
	    _.each(subdirs, function(dir) {

	    	var configName = dir.substr(configPath.length+1);
	    	
	    	var paths = [];
	    	paths = paths.concat(
	    		expandPathVariables( conf.src.assets, {config:configName})
	    	);

			var watcher = gwatch( paths, function(){
				gulp.start(['cleanup-and-copy-changed-assets'], function() {
					if (browserSyncOn) reload();
				});
			})

			.on('error', function (error) {
	            this.emit('end');
	        });

	        watchers.push(watcher);
		});
	});
});
gulp.task("cleanup-and-copy-changed-assets", function() {
	var configPath = path.join(__dirname, conf.src.root, "configs");
	walk(configPath, function(err, subdirs) {
    	if (err) throw err;
	    _.each(subdirs, function(dir) {
	    	var configName = dir.substr(configPath.length+1);
	    	var destPath = path.join(__dirname, conf.dest.path, configName, conf.dest.assets.path);

	    	var paths = [];
	    	paths = paths.concat(
	    		expandPathVariables( conf.src.assets, {config:configName})
	    	);

	    	gulp.src(paths)
	    		.pipe(tap(function(file){
	    			
	    		}))
	    		.pipe(collate("assets"))
	    		.pipe(tap(function(file){
	    			
	    		}))
	    		.pipe(deleted(destPath, expandPathVariables(conf.dest.assets.compare, {destination: destPath}) ))
	    		.pipe(tap(function(file){
	    			
	    		}))
	    		.pipe(changed(destPath))
	    		.pipe(gulp.dest( destPath ));
			
	    });
	});
});

/*
* APP Javascript
*/
gulp.task('app-json-dev-watch', ['app-json-dev'], function () {
	var paths = [];
	var configPath = path.join(__dirname, conf.src.root, "configs");
	walkSync(configPath, function(err, subdirs) {
		if (err) throw err;
		_.each(subdirs, function(dir) {
			var configName = dir.substr(configPath.length+1);
			var options = {config: configName};
			paths = paths.concat(expandPathVariables( conf.src['json'], options ));
			paths = _.uniq(paths);
		});
	});
	var watcher = gwatch( paths , function(event){
		gulp.start(['app-json-dev'], function() {
			if (browserSyncOn) reload();
		});
	}); // watch the same files in our scripts task
	watcher.on('change', function (event) {
		if (event.type === 'deleted') { // if a file is deleted, forget about it
			delete cache.caches['appjson'][event.path];
			remember.forget('appjson', event.path);
		}
	})
	.on('error', function (error) {
        this.emit('end');
    });
});
gulp.task('app-json-dev', function() {
	return json({
		"name": "app",
		"debug": true,
		"minify": false
	});
});
gulp.task('app-json', function() {
	return json({
		"name": "app",
		"debug": false,
		"minify": true
	});
});


/*
* APP Javascript
*/
gulp.task('app-javascript-dev-watch', ['app-javascript-dev'], function () {
	var watcher = gwatch( conf.src.javascript.app, function(){
		gulp.start(['app-javascript-dev'], function() {
			if (browserSyncOn) reload();
		});
	}); // watch the same files in our scripts task
	watcher.on('change', function (event) {
		if (event.type === 'deleted') { // if a file is deleted, forget about it
			delete cache.caches['appjavascript'][event.path];
			remember.forget('appjavascript', event.path);
		}
	})
	.on('error', function (error) {
        this.emit('end');
    });
});
gulp.task('app-javascript-dev', function() {
	return javascript({
		"name": "app",
		"debug": true,
		"minify": false
	});
});
gulp.task('app-javascript', function() {
	return javascript({
		"name": "app",
		"debug": false,
		"minify": true
	});
});
gulp.task('core-javascript-dev', function() {
	return javascript({
		"name": "core",
		"debug": true,
		"minify": false
	});
});
gulp.task('core-javascript', function() {
	return javascript({
		"name": "core",
		"debug": false,
		"minify": true
	});
});

/*
* APP LESS
*/
gulp.task('app-less-dev-watch', ['app-less-dev'], function() {
	var paths = [];
	var configPath = path.join(__dirname, conf.src.root, "configs");
	walkSync(configPath, function(err, subdirs) {
		if (err) throw err;
		_.each(subdirs, function(dir) {
			var configName = dir.substr(configPath.length+1);
			var options = {config: configName};
			paths = paths.concat(expandPathVariables( conf.src['less'], options ));
			paths = _.uniq(paths);
		});
	});
	var watcher = gwatch( paths , function(event){
		gulp.start(['app-less-dev'], function() {
			gulp.src( path.join(conf.dest.path,"**/css/main.css"))
			.pipe(gulpif(browserSyncOn, reload({stream:true})))
		});
	}); // watch the same files in our scripts task
	watcher.on('change', function (event) {
		if (event.type === 'deleted') { // if a file is deleted, forget about it
			delete cache.caches['appless'][event.path];
			remember.forget('appless', event.path);
		}
	})
	.on('error', function (error) {
	    this.emit('end');
	});
});
gulp.task('app-less-dev', function() {
	return less({
		"name": "app",
		"debug": true,
		"minify": false
	});
});
gulp.task('app-less', function() {
	return less({
		"name": "app",
		"debug": false,
		"minify": true
	});
});

/*
*	APP HANDLEBARS
*/
gulp.task('app-handlebars-dev-watch', ['app-handlebars-dev'], function() {
	var paths = [];
	var configPath = path.join(__dirname, conf.src.root, "configs");
	walkSync(configPath, function(err, subdirs) {
		if (err) throw err;
		_.each(subdirs, function(dir) {
			var configName = dir.substr(configPath.length+1);
			var options = {config: configName};
			paths = paths.concat(expandPathVariables( conf.src['handlebars'], options ));
			paths = _.uniq(paths);
		});
	});
	var watcher = gwatch( paths, function(){
		gulp.start(['app-handlebars-dev'], function() {
			if (browserSyncOn) reload();
		});
	}); 
});
gulp.task('app-handlebars-dev', function() {
	return handlebars({
		"name": "app",
		"debug": true,
		"minify": false
	});
});
gulp.task('app-handlebars', function() {
	return handlebars({
		"name": "app",
		"debug": false,
		"minify": true
	});
});


/*
* APP HTML
*/
gulp.task('app-index-dev', function() {
	return index({
		debug: true
	});
});
gulp.task('app-index', function() {
	return index({
		debug: false
	});
});



/*
* WORKER FUNCTIONS
*/
function javascript(options) {
	var isMinify = options.minify;
	var isDebug = options.debug;
	var sectionName = options.name;
	var destConfig = conf.dest;
	var srcConfig = conf.src;

	var opts = {
	  umd: false
	};

	var grabPaths;
	var moduleName;
	var loaderFile = path.join(__dirname, conf.dest.loader.file );

	if (sectionName == "core") {
		var paths = _.extend({}, conf.paths[sectionName]);
		var loaderConfig = {};
		_.extend(loaderConfig, { paths: paths } );
		_.extend(loaderConfig, {map: conf.map } );

		var globalConfig = require('etc')().file( path.join(__dirname, 'config.json') ).toJSON();

		var output = 'require.config(' + JSON.stringify( loaderConfig, null, 4) + ');\n'+
		'require(["buildsystem","app"], function() {\n'+
		'buildsystem.loaded.javascript = true;\n'+
		'});\n';
		
		
		fs.writeFileSync(loaderFile, output);

		grabPaths = srcConfig.javascript[sectionName];
		moduleName = "buildsystem";
	} else {
		grabPaths = srcConfig.javascript[sectionName].concat([loaderFile]);
		moduleName = "loader";
	}
	
	var sourcemappath = destConfig['javascript'][sectionName].sourcemappath || conf.dest.sourcemappath;
	var sourcemapbase = destConfig['javascript'][sectionName].sourcemapbase || conf.dest.sourcemapbase;

	var modules;
	if (conf.shim[sectionName] && conf.shim[sectionName][sectionName] && conf.shim[sectionName][sectionName].deps ) modules = conf.shim[sectionName][sectionName].deps;

	var stream = gulp.src( grabPaths, { base : "." } )
		
		
		.pipe(gulpif(isDebug, sourcemaps.init({debug:true})))

		.pipe(cache(sectionName+'javascript'))

		.pipe(remember(sectionName+'javascript'))

		.pipe(foreach(function(stream, file) {
			for (var k in conf.shimTo) {
				var dPath = path.join(__dirname, conf.src.root, k);
				if (file.path.substr(0, dPath.length) === dPath) {
					var fend = file.path.substr( path.join(__dirname, conf.src.root).length + 1);
					fend = fend.substr(0, fend.length-3);

					if (conf.shimTo[k].exclude.indexOf(fend) > -1) continue;
					if (_.values(conf.paths[sectionName]).indexOf(fend) > -1) continue;

					stream
						.pipe(gulpif(conf.jslint.indexOf(k) > -1, jshint()))
    					.pipe(gulpif(conf.jslint.indexOf(k) > -1, jshint.reporter('default')));

					var module = conf.shimTo[k].module;

					if (conf.shim[sectionName][module] !== undefined) {
						if (conf.shim[sectionName][module].deps.indexOf(fend) == -1)
							conf.shim[sectionName][module].deps.push(fend);
					}
					break;
				}
			}
			return stream;
		}))

		.pipe(amdOptimize(moduleName, {
			baseUrl: srcConfig.root,
			paths: conf.paths[sectionName],
			shim: conf.shim[sectionName],
			exclude: conf.exclude[sectionName],
			loader : amdOptimize.loader(
			    // Used for turning a moduleName into a filepath glob.
			    function (moduleName) { 
			    	var found = false;
			    	if (conf.exclude[sectionName] && conf.exclude[sectionName].indexOf(moduleName) > 0) return path.join(srcConfig.root, moduleName + ".js");
			    	for (var k in conf.redirect) {
			    		if (moduleName.substr(0, k.length) === k) {
			    			if (moduleName.substr(k.length) == "") {
			    				moduleName = path.join(srcConfig.root, conf.redirect[k] + ".js");
				    		} else {
				    			moduleName = path.join(srcConfig.root, conf.redirect[k], moduleName.substr(k.length) + ".js");
				    		}
				    		found = true;
			    			break;
			    		}
			    	}
			    	if (!found && modules !== undefined) {
			    		var finds = [];
			    		for (var i = 0; i < modules.length; i++) {
			    			var mlen = modules[i].length;
			    			if (modules[i].substr(mlen - moduleName.length ) == moduleName) {
			    				finds.push(modules[i]);
			    			}
			    		}
			    		if (finds.length > 1) {
			    			gutil.log(gutil.colors.red("Duplicate module names: " + JSON.stringify(finds)) )
				            // Notify on error. Uses node-notifier
				            notifier.notify({
				                title: 'Javascript compilation error',
				                message: "Duplicate module names: " + JSON.stringify(finds)
				            });
			    		} else if (finds.length == 1) {
			    			moduleName = path.join(srcConfig.root, finds[0] + ".js");
			    		}

			    	}
			    	return moduleName; 
			    }
			  )
		}, opts))

		.on('error', function (error) {
            gutil.log(gutil.colors.red(error.message))
            // Notify on error. Uses node-notifier
            notifier.notify({
                title: 'Javascript compilation error',
                message: error.message
            })
            this.emit('end');
        })


		.pipe(concat( destConfig.javascript[sectionName].file ))

		.pipe(gulpif(isDebug, sourcemaps.write("./",{ includeContent: true, sourceMappingURLPrefix: sourcemapbase, sourceRoot: sourcemappath } ) ))

        .pipe(gulpif(isDebug, tap(function(file) {
        	if (path.extname(file.path) == ".map") {
        		var json = JSON.parse(file.contents);
        		_.each(json.sources, function(source, index) {
        			for (var i = 0; i < conf.dest.sourcemappathtruncateby; i++) {
        				var fs = source.indexOf("/") + 1;
        				if (fs === 0) break;
        				source = source.substr(fs);
        			}
        			json.sources[index] = source;
        		});
        		file.contents = new Buffer(JSON.stringify(json));
        	}
        })))

        

		.pipe(gulpif(isMinify, uglify()));


	var configPath = path.join(__dirname, conf.src.root, "configs");
	walk(configPath, function(err, subdirs) {
    	if (err) throw err;
	    _.each(subdirs, function(dir) {
	    	var configName = dir.substr(configPath.length+1);
	    	var destPath = path.join(__dirname, conf.dest.path, configName);

	    	stream.pipe( gulp.dest( destPath ));
	    	
	    });
	});

	return stream;
}

function less(options) {
	var isMinify = options.minify;
	var isDebug = options.debug;
	var sectionName = options.name;
	var destConfig = conf.dest;
	var srcConfig = conf.src;

	var destFile = path.join(__dirname, conf.dest.path, destConfig.css.file );

	var sourcemappath = destConfig['css'].sourcemappath || destConfig.sourcemappath;
	var sourcemapbase = destConfig['css'].sourcemapbase || destConfig.sourcemapbase;

	var streams = [];
	
	var configPath = path.join(__dirname, conf.src.root, "configs");
	walkSync(configPath, function(err, subdirs) {
		if (err) throw err;
		_.each(subdirs, function(dir) {
			var configName = dir.substr(configPath.length+1);
			options.config = configName;
			var paths = expandPathVariables( srcConfig['less'], options );

		    var stream = gulp.src( paths, { base : "." }  )
		       
		        .pipe(gulpif(isDebug, sourcemaps.init()))

		        .pipe(cache(sectionName+'less'+(options.config||"")))
		        .pipe(remember(sectionName+'less'+(options.config||"")))

		        .pipe(concat( destConfig.css.file ))

		        .pipe(lessNSM())

		        .on('error', function (error) {
		            gutil.log(gutil.colors.red(error.message))
		            // Notify on error. Uses node-notifier
		            notifier.notify({
		                title: 'Less compilation error',
		                message: error.message
		            })
		            this.emit('end');
		        })

		        .pipe(concat( destConfig.css.file ))

		        .pipe(gulpif(isMinify, minifyCSS()))

		        .pipe(gulpif(isDebug, sourcemaps.write("./",{ includeContent: true, sourceMappingURLPrefix: sourcemapbase, sourceRoot: sourcemappath } ) ))

		        .pipe(tap(function(file) {
		        	if (path.extname(file.path) == ".map") {
		        		var json = JSON.parse(file.contents);
		        		_.each(json.sources, function(source, index) {
		        			for (var i = 0; i < conf.dest.sourcemappathtruncateby; i++) {
		        				var fs = source.indexOf("/") + 1;
		        				if (fs === 0) break;
		        				source = source.substr(fs);
		        			}
		        			json.sources[index] = source;
		        		});
		        		file.contents = new Buffer(JSON.stringify(json));
		        	}
		        }));

		   	stream.pipe(gulp.dest( path.join(__dirname, conf.dest.path, configName) ));

		   	

			streams.push(stream);
	    });
	});

	var sq = new streamqueue({objectMode: true});
	for (var i = 0; i < streams.length; i++) {
		sq.queue(streams[i]);
	}
	sq.done();
	
	return sq;
}

function handlebars(options){
	var isMinify = options.minify;
	var isDebug = options.debug;
	var sectionName = options.name;
	var destConfig = conf.dest;
	var srcConfig = conf.src;

	var sourcemappath = destConfig['templates'].sourcemappath || conf.dest.sourcemappath;
	var sourcemapbase = destConfig['templates'].sourcemapbase || conf.dest.sourcemapbase;

	var streams = [];

	var configPath = path.join(__dirname, conf.src.root, "configs");
	walk(configPath, function(err, subdirs) {
		if (err) throw err;
		_.each(subdirs, function(dir) {
			var configName = dir.substr(configPath.length+1);
			options.config = configName;
			var paths = expandPathVariables( srcConfig['handlebars'], options );

		  	var stream = gulp.src( paths, { base : "." }  )
			  	.pipe(gulpif(isDebug, sourcemaps.init()))

			  	//.pipe(cache(sectionName+'handlebars'+(options.config||"")))
				//.pipe(remember(sectionName+'handlebars'+(options.config||"")))

				.pipe(gulpif(isDebug, htmlhint({
					"doctype-first":false
				})))
    			.pipe(gulpif(isDebug, htmlhint.reporter()))
    			

			    .pipe(handlebarsSM())
			    .on('error', function (error) {
		            gutil.log(gutil.colors.red(error.message))
		            // Notify on error. Uses node-notifier
		            notifier.notify({
		                title: 'Javascript compilation error',
		                message: error.message
		            })
		            this.emit('end');
		        })
			    .pipe(wrap('Handlebars.template(<%= contents %>)'))
			    .pipe(declare({
			      namespace: 'buildsystem.json.templates',
			      noRedeclare: true // Avoid duplicate declarations
			    }))
			    
		    
			    .pipe(concat( destConfig.templates.file ))
			    .pipe(wrap('require(["buildsystem"],function(){\n<%= contents %>\nbuildsystem.sync("pull");\nbuildsystem.loaded.templates = true;\n});'))
			    
			    .pipe(gulpif(isMinify, uglify()))
			    
			    .pipe(gulpif(isDebug, sourcemaps.write("./",{ includeContent: true, sourceMappingURLPrefix: sourcemapbase, sourceRoot: sourcemappath } ) ))

			    .pipe(tap(function(file) {
			        	if (path.extname(file.path) == ".map") {
			        		var json = JSON.parse(file.contents);
			        		_.each(json.sources, function(source, index) {
			        			for (var i = 0; i < conf.dest.sourcemappathtruncateby; i++) {
			        				var fs = source.indexOf("/") + 1;
			        				if (fs === 0) break;
			        				source = source.substr(fs);
			        			}
			        			json.sources[index] = source;
			        		});
			        		file.contents = new Buffer(JSON.stringify(json));
			        	}
			        }));
			
	    	
	    	stream.pipe(gulp.dest( path.join(__dirname, conf.dest.path, configName) ));

	    	streams.push[stream]
	    });
	});


	var sq = new streamqueue({ objectMode: true });
	for (var i = 0; i < streams.length; i++) {
		sq.queue(streams[i]);
	}
	sq.done();
	return sq;

    
}

function json(options) {
	var isMinify = options.minify;
	var isDebug = options.debug;
	var sectionName = options.name;
	var destConfig = conf.dest;
	var srcConfig = conf.src;

	var sourcemappath = destConfig['json'].sourcemappath || conf.dest.sourcemappath;
	var sourcemapbase = destConfig['json'].sourcemapbase || conf.dest.sourcemapbase;	

	var configPath = path.join(__dirname, conf.src.root, "configs");
	walk(configPath, function(err, subdirs) {
    	if (err) throw err;
	    _.each(subdirs, function(dir) {
	    	var configName = dir.substr(configPath.length+1);
	    	var destPath = path.join(__dirname, conf.dest.path, configName);

			options.config = configName;
			var paths = expandPathVariables( srcConfig['json'], options );

			var stream = gulp.src( paths, { base : "." } )
				
				.pipe(gulpif(isDebug, sourcemaps.init({debug:true})))

				.pipe(cache(sectionName+'json'))

				.pipe(remember(sectionName+'json'))

				.pipe(gulpif(isDebug, jsonlint()))
        		.pipe(gulpif(isDebug, jsonlint.report('verbose')))

				.pipe(concatJSON(destConfig.json.file))
				.on('error', function (error) {
		            gutil.log(gutil.colors.red(error.message))
		            // Notify on error. Uses node-notifier
		            notifier.notify({
		                title: 'JSON compilation error',
		                message: error.message
		            })
		            this.emit('end');
		        })
				.pipe(wrap("require(['buildsystem'], function() { buildsystem.data.push(<%= contents %>); })"))


				.pipe(gulpif(isDebug, sourcemaps.write("./",{ includeContent: true, sourceMappingURLPrefix: sourcemapbase, sourceRoot: sourcemappath } ) ))

			    .pipe(tap(function(file) {
		        	if (path.extname(file.path) == ".map") {
		        		var json = JSON.parse(file.contents);
		        		_.each(json.sources, function(source, index) {
		        			for (var i = 0; i < conf.dest.sourcemappathtruncateby; i++) {
		        				var fs = source.indexOf("/") + 1;
		        				if (fs === 0) break;
		        				source = source.substr(fs);
		        			}
		        			json.sources[index] = source;
		        		});
		        		file.contents = new Buffer(JSON.stringify(json));
		        	}
		        }))

				.pipe(gulpif(isMinify, jsonminify()))

	
	    	stream.pipe( gulp.dest( destPath ));
	    	
	    });
	});

}

function index(options) {
	var isMinify = options.minify;
	var isDebug = options.debug;
	var sectionName = options.name;
	var destConfig = conf.dest;
	var srcConfig = conf.src;

	var stream = gulp.src( conf.src.index, { base : conf.src.path }  );

	var configPath = path.join(__dirname, conf.src.root, "configs");
	walk(configPath, function(err, subdirs) {
    	if (err) throw err;
	    _.each(subdirs, function(dir) {
	    	var configName = dir.substr(configPath.length+1);
	    	stream
	    		.pipe(concat(conf.dest.index.file))
	    		.pipe(gulp.dest( path.join(conf.dest.path, configName) ));
	    });
	});

	return stream;
}
