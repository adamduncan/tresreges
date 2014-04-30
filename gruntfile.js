module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/* <%= pkg.name %> / <%= pkg.author %> / <%= grunt.template.today("yyyy-mm-dd") %> */\n',
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'images/svg',
					src: ['**/*.svg'],
					dest: 'images/svgmin',
					ext: '-min.svg'
				}]
			}
		},
		jshint: {
			all: ['Gruntfile.js', 'scripts/common.js'],
			options: {
				lastsemic: true,
				strict: false,
				unused: false,
				globals: {
					jQuery: true
				}
			}
		},
		sass: {
			dist: {
				files: {
					'css/style.css': 'css/scss/style.scss'
				}
			}
		},
		cmq: {
			your_target: {
				files: {
					'css': ['css/style.css']
				}
			}
		},
		uncss: {
			dist: {
				files: {
					'css/style.css': ['index.html']
				}
			},
			options: {
				ignore: [/^.svg/, /^.no-svg/, /^.js/, /^.no-js/, /.current$/, '::-moz-selection', '::selection'],
				ignoreSheets: [/fonts.googleapis/]
			}
		},
		cssmin: {
			add_banner: {
				options: {
					banner: '<%= banner %>'
				},
				files: {
					'css/style.min.css': ['css/style.css']
				}
			}
		},
		concat: {
			options: {
				stripBanners: true,
				banner: '<%= banner %>'
			},
			all: {
				src: [
					'scripts/vendor/jquery.debouncedresize.js',
					'scripts/vendor/jquery.easing.custom.js',
					'scripts/vendor/jquery.stellar.js',
					'scripts/vendor/idangerous.swiper.js',
					'scripts/common.js'
				],
				dest: 'scripts/all.js'
			},
			head: {
				src: [
					'scripts/vendor/modernizr.custom.72536.js',
					'scripts/vendor/respond.min.js'
				],
				dest: 'scripts/head.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				warnings: false
			},
			build: {
				files: {
					'scripts/all.min.js': ['scripts/all.js'],
					'scripts/head.min.js': ['scripts/head.js']
				}
			}
		},
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['default']
			},
			src: {
				files: [
					'scripts/common.js',
					'scripts/vendor/*.js',
					'css/scss/*.scss'],
				tasks: ['default']
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-svgmin');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-combine-media-queries');
	grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['sass', 'cmq', 'concat', 'jshint']);
	grunt.registerTask('build', ['sass', 'cmq', 'uncss', 'cssmin', 'concat', 'jshint', 'uglify']);
	grunt.registerTask('svg', ['svgmin']);

};