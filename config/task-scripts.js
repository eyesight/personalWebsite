import debug from 'gulp-debug';
import webpack from 'webpack';
import webpackstream from 'webpack-stream';


module.exports = function (config, gulp, logger) {
	return function () {
    return gulp.src([config.src])
		  // debug
		  // .pipe(debug({title: 'scripts:'}))
			// webpack
			.pipe(
				  webpackstream({
					mode: 'production',
            devtool: 'source-map',
            module: {
              rules: [
                {
                  parser: {
                    amd: false
                  }
                },
                {
                  test: /\.js$/,
                  exclude: /node_modules/,
                  loader: "babel-loader"
                }
              ]
            },
            output: {
              library: 'CF',
              filename: 'script.min.js'
            },
            performance: {
					    hints: false
					  }
				}, webpack)
			)
			.on('error', logger)
			.pipe(gulp.dest(config.dest));
	};
};
