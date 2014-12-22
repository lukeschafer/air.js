module.exports = function(grunt) {
  grunt.initConfig({
    jasmine : {
      air: {
        src : 'air.js',
        options: {
          specs : 'specs/*.js',
          helpers : 'specs/helpers/*.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', 'jasmine');
};
