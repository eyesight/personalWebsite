import { config as fullconfig } from './config.js';

module.exports = function(config, gulp, logger) {
	return function() {
		// we need the configuration for all task here (config is only the current task)
		config = fullconfig;
		gulp.watch(config.styles.args.watch, { interval: 500 }, gulp.series('styles'));
		gulp.watch(config.scripts.args.watch, { interval: 500 }, gulp.series('scripts'));
		gulp.watch(config.svg.args.src, { interval: 500 }, gulp.series('svg'));
	};
};
