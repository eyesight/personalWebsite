import debug from 'gulp-debug';
import sassLint from 'gulp-sass-lint';

module.exports = function (config, gulp, logger) {
	return function () {
		return gulp.src(config.src)
		  // debug
			// .pipe(debug({title: 'lintcss:'}))
			.pipe(sassLint())
			.pipe(sassLint.format())
			.pipe(sassLint.failOnError());
	};
};
