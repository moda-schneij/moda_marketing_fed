var gulp = require('gulp'),
	gutil = require('gulp-util'),
	watch = require('gulp-watch'),
	Path = require('path'),
	connect = require('connect'),
	reloadOnChange = require('watch-connect'),
	sass = require('gulp-sass'),
	open = require('gulp-open'),
	lr = require('tiny-lr'),
	refresh = require('gulp-livereload'),
	lr_server = lr(),
	
	path = Path.resolve('./'),
	server = connect(),
	server_options = {
		watchdir:path,
		server:server,
		verbose:true,
		additionaldirs:['./css/theme/source/']
	};
	
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

gulp.task('default', function() {
	var options = {
		url: "http://127.0.0.1:9000",
		app: "chrome"
	};
	gulp.run('serve');
	gulp.src("./index.html")
		.pipe(open("", options));
	lr_server.listen(35729, function (error) {
		if (error) {
			return console.log(error);
		}
		console.log('Livereload server running');
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
});

//gulp.task('default', function(){
//	return gulp.src('css/theme/source/*.scss')
//		.pipe(watch())
		//.pipe(sass())
//		.pipe(gulp.dest('css/theme/*.css'));
//});

