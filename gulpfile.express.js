var gulp = require('gulp');
var	gutil = require('gulp-util');
//var	watch = require('gulp-watch');
var	Path = require('path');
var path = Path.resolve('./');
var	express = require('express');
var	connect = require('connect');
var	reloadOnChange = require('watch-connect');
var	sass = require('gulp-sass');
var	open = require('gulp-open');
var	tinylr = require('tiny-lr');
var	refresh = require('gulp-livereload');
var	lr_server = tinylr();
	
//	path = Path.resolve('./'),
var	server = connect();
var	server_options = {
		watchdir:path,
		server:server,
		verbose:true,
		additionaldirs:['./css/theme/source/']
	};
	
var	createServers = function(port, lrport) {
	  var lr = tinylr();
	  lr.listen(lrport, function() {
		gutil.log('LR Listening on', lrport);
	  });
	 
	  var app = express(),
		http = require('http'),
		server = http.createServer(app),
		io = require('socket.io').listen(server);
	  app
		.use(express.query())
		.use(express.bodyParser())
		// .use(tinylr.middleware({ app: app }))
		.use(express.static(path))
		.use(express.directory(path));
		// .listen(lrport, function(){
			// gutil.log('LR Listening on', lrport);
		// });
	server.listen(port, function() {
		gutil.log('Listening on', port);
	  });
	 
	  return {
		lr: lr,
		app: app
	  };
	};

var servers = createServers(9000, 35729);
	
server.use(reloadOnChange(server_options));
server.use(connect.static(path));

gulp.task('reload', function() {
	gulp.src([
	'**/*.html',
	'**/*.php'
	])
	.pipe(refresh(lr_server));
});	
	
gulp.task('watch', function() {
	gulp.watch([ 
		'css/theme/source/*.scss',
		'css/theme/template/*.scss'
		], function(event) {
		gulp.run('sass');
	});
	gulp.watch([
		'**/*.html',
		'**.php'
		], function(event) {
		gulp.run('reload');
	});
});

gulp.task('sass', function() {
	gulp.src(['css/theme/source/*.scss',
			'!css/theme/source/settings.scss'
			])
        .pipe(sass({
			includePaths: ['css/theme/template']
		}))
        .pipe(gulp.dest('css/theme'))
		.pipe(refresh(lr_server));
});

gulp.task('livereload', function(){  
    lr_server.listen(35729, function(err){
        if(err) {
			return console.log(err);
		}
    });
});


gulp.task('serve', function(){
	//connect().use(connect.static(__dirname + '/')).listen(9000);
	server.listen(9000, function(err){
		console.log('listening on http://127.0.0.1:9000');
		if(err) {
			return console.log(err);
		}
	});
});

gulp.task('default', function(){
	var options = {
		url: "http://127.0.0.1:9000",
		app: "chrome"
	};
  gulp.watch(["./**/*", "!./node_modules/**/*"], function(evt){
    gutil.log(gutil.colors.cyan(evt.path), 'changed');
    servers.lr.changed({
      body: {
        files: [evt.path]
      }
    });
  });
  gulp.src("./index.html")
	.pipe(open("", options));
});

// gulp.task('default', function() {
	// var options = {
		// url: "http://127.0.0.1:9000",
		// app: "chrome"
	// };
	// gulp.run('serve');
	// gulp.src("./index.html")
		// .pipe(open("", options));
	// lr_server.listen(35729, function (error) {
		// if (error) {
			// return console.log(error);
		// }
		// console.log('Livereload server running');
		// gulp.watch([ 
			// 'css/theme/source/*.scss',
			// 'css/theme/template/*.scss'
			// ], function(event) {
			// gulp.run('sass');
		// });
		// gulp.watch([
			// '**/*.html',
			// '**.php'
			// ], function(event) {
			// gulp.run('reload');
		// });
	// });
// });

//gulp.task('default', function(){
//	return gulp.src('css/theme/source/*.scss')
//		.pipe(watch())
		//.pipe(sass())
//		.pipe(gulp.dest('css/theme/*.css'));
//});

