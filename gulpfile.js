var browserify = require('browserify'),
	gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	ngAnnotate = require('gulp-ng-annotate'),
	gutil = require('gulp-util');

	gulp.task('javascript', function () {
		var b = browserify({
			entries: './app.js',
			debug: true
		});

		return b.bundle()
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps:true}))
				//transform tasks
				.pipe(ngAnnotate())
				.pipe(uglify())
				.on('error', gutil.log)
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/js'));
	});