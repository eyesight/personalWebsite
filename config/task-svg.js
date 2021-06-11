import debug from 'gulp-debug';
import rename from 'gulp-rename';
import svgmin from 'gulp-svgmin';

module.exports = function(config, gulp, logger) {
	return function() {
		return gulp.src(config.src)
			// debug
			// .pipe(debug({title: 'svg:'}))
			.pipe(svgmin({
        plugins: [{
          removeViewBox: false
         }]
      }))
			.pipe(rename({
				suffix: '.min'
			}))
			.on('error', logger)
			.pipe(gulp.dest(config.dest));
	};
};
