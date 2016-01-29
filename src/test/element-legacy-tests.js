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
    var element = $compile('<zxcvbn password="password"></zxcvbn>')($rootScope);
    $rootScope.$digest();

    //  Replacer is not needed here as calc_time is not included in the html
    var expected = JSON.stringify(zxcvbn($rootScope.password).crack_times_display); // jshint ignore:line
    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password);
    expect(element.html()).toEqual(expected);
  });

  it('should call zxcvbn with 2 parameters when the "extra" attribute is used', function () {
    $rootScope.password = 'randomness';
    $rootScope.extras = 'randomness';
    $compile('<zxcvbn password="password" extras="extras"></zxcvbn>')($rootScope);
    $rootScope.$digest();

    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.extras);
  });

  it('should give full data to attribute `fullData`', function () {
    $rootScope.password = 'randomness';
    $rootScope.extras = ['randomness'];
    $compile('<zxcvbn password="password" extras="extras" data="fullData"></zxcvbn>')($rootScope);
    $rootScope.$digest();

    var expected = JSON.stringify(zxcvbn($rootScope.password, $rootScope.extras), zxcvbnJsonReplacer);
    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.extras);
    expect(JSON.stringify($rootScope.fullData, zxcvbnJsonReplacer)).toEqual(expected);
  });


  var invalidValues = [undefined, null, 1, NaN, angular.isString];

  function invalidValueTestHelper(value) {
    it('should not call zxcvbn on non-string values (including undefined and null', function () {

      var fullData = 'string not object';
      $rootScope.password = value;
      $rootScope.fullData = fullData;
      $compile('<zxcvbn password="password" data="fullData"></zxcvbn>')($rootScope);
      $rootScope.$digest();

      expect(window.zxcvbn).not.toHaveBeenCalled();
      expect($rootScope.fullData).toEqual(jasmine.any(String));
      expect($rootScope.fullData).toEqual(fullData);
    });
  }

  for (var i = 0; i < invalidValues.length; i++) {
    invalidValueTestHelper(invalidValues[i]);
  }


  function zxcvbnJsonReplacer(key, value) {
    // As the calculation time can vary we should exclude it from the json comparison
    if (key === 'calc_time') return undefined;
    return value;
  }
});
