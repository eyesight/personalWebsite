import destinations from 'gulp-multi-dest';

module.exports = function (config, gulp, logger) {
  return function () {
    return gulp.src(config.src)
      .pipe(destinations(config.dest));
  };
};