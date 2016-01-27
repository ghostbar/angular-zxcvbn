'use strict';

module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    reporters: ['progress', 'coverage'],

    files: [
      'bower_components/zxcvbn/dist/zxcvbn.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'src/**/*.js'
    ],

    exclude: [],

    preprocessors: {
      'src/main/**/*.js': ['coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
