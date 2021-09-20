export const config = {

	styles: {
		args: {
			src: './src/scss/*.scss',
			watch: './src/scss/**/*.scss',
			dest: ['./dist/css']
		}
	},

	scripts: {
		args: {
			src: './src/js/js.js',
			watch: './src/js/**/*.js',
			dest: ['./dist/js']
		}
	},

	fonts: {
		args: {
			src: './src/fonts/*',
			watch: './src/fonts/*',
			dest: ['./dist/fonts']
		}
	},

	svg: {
		args: {
			src: [
				'src/svg/**/*.svg'
			],
			dest: './dist/svg/'
		}
	},

	lintjs: {
		args: {
			src: './src/js/**/*.js'
		}
	},

	lintcss: {
		args: {
			src: './src/scss/**/*.scss'
		}
	},

	watch: {}

};
