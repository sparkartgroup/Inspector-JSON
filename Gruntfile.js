module.exports = function( grunt ){

	var pkg = grunt.file.readJSON('package.json');
	var banner = '/* Inspector JSON v'+ pkg.version +'\n'+
	'   Generated on <%= grunt.template.today("yyyy-mm-dd \'at\' HH:MM:ss") %> */\n\n';

	grunt.initConfig({
		browserify: {
			script: {
				options: {
					standalone: 'InspectorJSON'
				},
				files: {
					'inspector-json.js': 'lib/index.js'
				}
			},
			test: {
				files: {
					'test/assets/test.js': 'test/index.js'
				}
			}
		},
		jshint: {
			script: ['lib/**/*.js']
		},
		uglify: {
			script: {
				options: {
					banner: banner
				},
				files: {
					'inspector-json.js': 'inspector-json.js'
				}
			}
		},
		watch: {
			script: {
				files: ['lib/**/*.js'],
				tasks: ['buildscript']
			},
			test: {
				files: ['lib/**/*.js','test/index.js'],
				tasks: ['buildtest']
			}
		}
	});

	// the cool/easy way to do it
	Object.keys( pkg.devDependencies ).forEach( function( dep ){
		if( dep.substring( 0, 6 ) === 'grunt-' ) grunt.loadNpmTasks( dep );
	});

	grunt.registerTask( 'default', ['dev'] );
	grunt.registerTask( 'buildscript', ['jshint:script','browserify:script','uglify:script'] );
	grunt.registerTask( 'buildtest', ['browserify:test'] );
	grunt.registerTask( 'build', ['buildscript','buildtest'] );
	grunt.registerTask( 'dev', ['build','watch'] );

};