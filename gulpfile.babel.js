import {config} from './config/config.js';
import gulp from 'gulp';


const logger = function (error) {
	console.log(error);
	if (this.emit) {
		this.emit('end');
	}
};


const loader = function (task) {
	let taskConfig = '';
	for (let [key, values] of Object.entries(config)) {
		if (key === task) {
			taskConfig = values.args;
			break;
		}
	}
	return require('./config/task-' + task)(taskConfig, gulp, logger);
};


/* *** Gulp Tasks *** */


for (let task of Object.keys(config)) {
	gulp.task(task, loader(task));
}

gulp.task('default',
  gulp.series(
    gulp.parallel('styles', 'scripts', 'svg'), 'watch'
  )
);
