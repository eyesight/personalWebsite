import autoprefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean-css';
import debug from 'gulp-debug';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import destinations from 'gulp-multi-dest';


module.exports = function (config, gulp, logger) {
	return function () {
		return gulp.src(config.src)
		  // debug
			// .pipe(debug({title: 'styles:'}))
			.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer())
			.on('error', logger)
			// minify
			.pipe(clean())
			.on('error', logger)
			.pipe(sourcemaps.write('.'))
			.pipe(destinations(config.dest));
	};
};
