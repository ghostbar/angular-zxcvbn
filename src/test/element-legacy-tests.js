/* global describe,beforeEach,it,inject,chai */

'use strict';

describe('zxcvbn directive', function () {
  var $compile, $rootScope;

  beforeEach(module('zxcvbn'));

  beforeEach(inject(
    function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      spyOn(window, 'zxcvbn').and.callThrough();
    }
  ));

  it('should show the results of zxcvbn("randomness") when the directive element is used with a scope variable with the value "randomness"', function () {
    $rootScope.password = 'randomness';
    var element = $compile('<zxcvbn password=\'password\'></zxcvbn>')($rootScope);
    $rootScope.$digest();

    //  Replacer is not needed here as calc_time is not included in the html
    var expected = JSON.stringify(zxcvbn($rootScope.password).crack_times_display);
    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password);
    expect(element.html()).toEqual(expected);
  });

  it('should call zxcvbn with 2 parameters when the "extra" attribute is used', function () {
    $rootScope.password = 'randomness';
    $rootScope.extras = 'randomness';
    $compile('<zxcvbn password=\'password\' extras=\'extras\' ></zxcvbn>')($rootScope);
    $rootScope.$digest();

    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.extras);
  });

  it('should give full data to attribute `fullData`', function () {
    $rootScope.password = 'randomness';
    $rootScope.extras = ['randomness'];
    $rootScope.fullData = {};
    $compile('<zxcvbn password=\'password\' extras=\'extras\' full=\'fullData\'></zxcvbn>')($rootScope);
    $rootScope.$digest();

    var expected = JSON.stringify(zxcvbn($rootScope.password, $rootScope.extras), zxcvbnJsonReplacer);
    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.extras);
    expect(JSON.stringify($rootScope.fullData, zxcvbnJsonReplacer)).toEqual(expected);
  });


  function zxcvbnJsonReplacer(key, value) {
    // As the calculation time can vary we should exclude it from the json comparison
    if (key == 'calc_time') return undefined;
    return value;
  }
});
