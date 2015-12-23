'use strict';

describe('zxcvbn attribute directive', function () {
  var $compile, $rootScope;

  beforeEach(module('zxcvbn'));

  beforeEach(inject(
    function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      spyOn(window, 'zxcvbn').and.callThrough();
    }
  ));

  /*
   Test Cases:

   1. Test 'zxcvbn' on element with ng-model -  scope.zxcvbn exists, scope.zxcvbnExtras is undefined, zxcvbn is called with 1 argument
   2. Test 'zxcvbn' on element without ng-model throws angular error
   3. Test 'zxcvbn' with form object - check scope.zxcvbnExtras is correct model values, check zxcvbn is called
   4. Test 'zxcvbn' with form and then
   4. Test 'zxcvbn' with array of strings - check scope.zxcvbn is correct




   */
  it('should call the zxcvbn function when used with ng-model and attach the result to scope.zxcvbn', function () {
    $rootScope.password = 'password';
    $rootScope.zxcvbn = {};
    $compile('<input type="password" ng-model="password" zxcvbn>')($rootScope);

    $rootScope.$digest();

    var actual = JSON.stringify($rootScope.zxcvbn, zxcvbnJsonReplacer);
    var expected = JSON.stringify(zxcvbn($rootScope.password), zxcvbnJsonReplacer);
    expect(actual).toEqual(expected);
    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password);
    expect($rootScope.zxcvbnExtras).toBeUndefined();
  });

  it('should fail to compile when used without ng-model', function() {

  });

  function zxcvbnJsonReplacer(key, value) {
    // As the calculation time can vary we should exclude it from the json comparison
    if (key === 'calc_time') return undefined;
    return value;
  }

});