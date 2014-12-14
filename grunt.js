module.exports = function(grunt) {
  grunt.initConfig({
    jasmine : {
      // Your project's source files
      src : 'air.js',
      // Your Jasmine spec files
      specs : 'specs/**/*spec.js',
      // Your spec helper files
      helpers : 'specs/helpers/*.js'
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-jasmine-runner');

  // Default task.
  grunt.registerTask('test', 'jasmine');
};
