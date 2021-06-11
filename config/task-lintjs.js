import debug from 'gulp-debug';
import xo from 'gulp-xo';

module.exports = function (config, gulp, logger) {
	return function () {
		return gulp.src(config.src)
  		// debug
			// .pipe(debug({title: 'lintjs:'}))
			.pipe(xo())
			.pipe(xo.format())
			.pipe(xo.failAfterError())
			.on('error', function () {
				this.emit('end')
			});
	};
};
