/* global describe,beforeEach,it,inject,chai */

'use strict';

describe('zxcvbn directive', function () {
  var $compile, $rootScope;
  var expect = chai.expect;

  beforeEach(module('angular-zxcvbn'));

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

  it('With input of "randomness" on extra too should say', function () {
    $rootScope.password = 'randomness';
    $rootScope.extra = 'randomness';
    var element = $compile('<zxcvbn password=\'password\' extra=\'extra\'></zxcvbn>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.equal('instant');
  });
});
