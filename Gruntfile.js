module.exports = function(grunt) {
  grunt.initConfig({
    jasmine : {
      air: {
        // Your project's source files
        src : 'air.js',
        options: {
          // Your Jasmine spec files
          specs : 'specs/*.js',
          // Your spec helper files
          helpers : 'specs/helpers/*.js'
        }
      }
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task.
  grunt.registerTask('test', 'jasmine');
};
