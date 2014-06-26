/* global describe,beforeEach,it,inject,chai */

'use strict';

describe('zxcvbn directive', function () {
  var $compile, $rootScope;
  var expect = chai.expect;

  beforeEach(module('zxcvbn'));

  beforeEach(inject(
    ['$compile', '$rootScope', function ($c, $r) {
      $compile = $c;
      $rootScope = $r;
    }]
  ));

  it('With input of "randomness" should say 4 minutes', function () {
    $rootScope.password = 'randomness';
    var element = $compile('<zxcvbn password=\'password\'></zxcvbn>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.equal('4 minutes');
  });

  it('With input of "randomness" on extra too should say `instant`', function () {
    $rootScope.password = 'randomness';
    $rootScope.extra = 'randomness';
    var element = $compile('<zxcvbn password=\'password\' extra=\'extra\'></zxcvbn>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.equal('instant');
  });

  it('should give full data to variable `fullData`', function () {
    $rootScope.password = 'randomness';
    $rootScope.extra = 'randomness';
    $rootScope.fullData = {};
    $compile('<zxcvbn password=\'password\' extra=\'extra\' full=\'fullData\'></zxcvbn>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.fullData.crack_time_display).to.equal('instant');
  });
});
