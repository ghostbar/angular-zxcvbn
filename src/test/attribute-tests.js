'use strict';

describe('zxcvbn attribute directive', function () {
  var $compile, $rootScope;

  var exampleFormHtml =
    '  <form name="myForm">' +
    '  <input type="text" ng-if="showHidden" ng-model="hidden" name="hidden">' + // use ng-if as that removes the element all together
    '  <input type="email" ng-model="email" name="emailAddress">' +
    '  <input type="text" ng-model="username" name="username">' +
    '  <input type="password" ng-model="password" name="password" zxcvbn="myForm">' +
    '  <input type="password" ng-model="confirmPassword" name="confirmPassword">' +
    '</form>';

  beforeEach(module('zxcvbn'));

  beforeEach(inject(
    function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      spyOn(window, 'zxcvbn').and.callFake(function () {
        // With zxcvbn 4.2.0 we rely on it returning an object containing 'score' as a int property
        return {
          score: 2
        };
      });
    }
  ));

  it('should call the zxcvbn function when used with ng-model and attach the result to scope.zxcvbn', function () {
    var password = 'password';
    $rootScope.password = password;
    $rootScope.zxcvbn = {};
    $compile('<input type="password" ng-model="password" zxcvbn>')($rootScope);

    $rootScope.$digest();

    var actual = JSON.stringify($rootScope.zxcvbn);
    var expected = JSON.stringify(zxcvbn($rootScope.password));
    expect(actual).toEqual(expected);
    expect($rootScope.zxcvbnPassword).toEqual(password);
    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password);
    expect($rootScope.zxcvbnExtras).toBeUndefined();
  });

  it('should fail to compile when used without ng-model', function () {
    $rootScope.password = 'password';
    $rootScope.zxcvbn = {};

    expect(function () {
        $compile('<input type="password" zxcvbn>')($rootScope);
      }
    ).toThrow();
  });

  it('should recall the zxcvbn when the password changes', function () {
    var oldPassword = 'password';
    var newPassword = 'qwerty';

    $rootScope.password = oldPassword;
    $compile('<input type="password" ng-model="password" zxcvbn>')($rootScope);
    $rootScope.$digest();
    expect($rootScope.zxcvbnPassword).toEqual(oldPassword);
    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password);
    expect($rootScope.zxcvbnExtras).toBeUndefined();

    $rootScope.password = angular.copy(newPassword);
    $rootScope.$digest();

    var actual = JSON.stringify($rootScope.zxcvbn);
    var expected = JSON.stringify(zxcvbn($rootScope.password));
    expect(actual).toEqual(expected);
    expect($rootScope.zxcvbnPassword).toEqual(newPassword);
    expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password);
    expect($rootScope.zxcvbnExtras).toBeUndefined();
  });

  describe('with extras attribute with form object', function () {
    it('should detect that a form object has been passed and add named fields as extras - but ignores password fields', function () {
      $rootScope.email = 'test@example.com';
      $rootScope.username = 'jonskeet';
      $rootScope.password = 'password';
      $rootScope.confirmPassword = 'wrong_password';
      $compile(exampleFormHtml)($rootScope);

      $rootScope.$digest();

      var actual = JSON.stringify($rootScope.zxcvbn);
      var expected = JSON.stringify(zxcvbn($rootScope.password, [$rootScope.email, $rootScope.username]));
      expect(actual).toEqual(expected);
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toContain($rootScope.email, $rootScope.username);
      expect($rootScope.zxcvbnExtras.length).toBe(2);
    });

    it('should detect a form field change and make another call to zxcvbn with the updated value', function () {
      var oldUsername = 'jonskeet';
      var newUsername = 'chucknorris';

      $rootScope.email = 'test@example.com';
      $rootScope.username = angular.copy(oldUsername);
      $rootScope.password = 'password';
      $rootScope.confirmPassword = 'wrong_password';
      $compile(exampleFormHtml)($rootScope);
      $rootScope.$digest();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toContain(oldUsername);
      expect($rootScope.zxcvbnExtras.length).toBe(2);

      $rootScope.username = angular.copy(newUsername);
      $rootScope.$digest();

      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toContain(newUsername);
      expect($rootScope.zxcvbnExtras.length).toBe(2);
    });

    it('should detect when a form field has been added and recall zxcvbn with the added field too', function () {
      $rootScope.hidden = 'chucknorris';
      $rootScope.email = 'test@example.com';
      $rootScope.username = 'john_skeet';
      $rootScope.password = 'password';
      $rootScope.confirmPassword = 'wrong_password';
      $rootScope.showHidden = false;

      // First check that scope.myForm.hidden doesn't exist
      $compile(exampleFormHtml)($rootScope);
      $rootScope.$digest();
      expect($rootScope.myForm.hidden).toBeUndefined();
      expect(window.zxcvbn).toHaveBeenCalled();
      expect($rootScope.zxcvbnExtras).toContain($rootScope.email, $rootScope.username);
      expect($rootScope.zxcvbnExtras.length).toBe(2);
      expect($rootScope.zxcvbnExtras).not.toContain($rootScope.hidden);

      // Now show the element
      $rootScope.showHidden = true;
      $rootScope.$digest();
      expect($rootScope.myForm.hidden).toBeDefined();
      expect(window.zxcvbn).toHaveBeenCalled();
      expect($rootScope.zxcvbnExtras).toContain($rootScope.email, $rootScope.username, $rootScope.hidden);
      expect($rootScope.zxcvbnExtras.length).toBe(3);
    });

    it('should detect when a form field has been removed and recall zxcvbn without that field', function () {
      $rootScope.hidden = 'chucknorris';
      $rootScope.email = 'test@example.com';
      $rootScope.username = 'john_skeet';
      $rootScope.password = 'password';
      $rootScope.confirmPassword = 'wrong_password';
      $rootScope.showHidden = true;

      // First check that scope.myForm.hidden does exist
      $compile(exampleFormHtml)($rootScope);
      $rootScope.$digest();
      expect($rootScope.myForm.hidden).toBeDefined();
      expect(window.zxcvbn).toHaveBeenCalled();
      expect($rootScope.zxcvbnExtras).toContain($rootScope.email, $rootScope.username, $rootScope.hidden);
      expect($rootScope.zxcvbnExtras.length).toBe(3);

      // Now hide the element
      $rootScope.showHidden = false;
      $rootScope.$digest();
      expect($rootScope.myForm.hidden).toBeUndefined();
      expect(window.zxcvbn).toHaveBeenCalled();
      expect($rootScope.zxcvbnExtras).toContain($rootScope.email, $rootScope.username);
      expect($rootScope.zxcvbnExtras.length).toBe(2);
      expect($rootScope.zxcvbnExtras).not.toContain($rootScope.hidden);
    });

  });

  describe('with extras attribute with array of strings', function () {

    it('should detect when a string array is passed and use them as an argument for the zxcvbn call', function () {
      $rootScope.myExtrasArray = ['john', 'skeet', 'mad_dog_john@hotmail.com'];
      $rootScope.password = 'password';
      $compile('<input type="password" ng-model="password" zxcvbn="myExtrasArray">')($rootScope);
      $rootScope.$digest();

      var actual = JSON.stringify($rootScope.zxcvbn);
      var expected = JSON.stringify(zxcvbn($rootScope.password, $rootScope.myExtrasArray));
      expect(actual).toEqual(expected);
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toEqual($rootScope.myExtrasArray);
      expect($rootScope.zxcvbnExtras.length).toBe(3);
    });

    it('should detect when an element in the array changes and recall zxcvbn', function () {
      var oldUsername = 'jon_skeet';
      var newUsername = 'chuck_norris';

      $rootScope.myExtrasArray = ['test@example.com', oldUsername];
      $rootScope.password = 'password';
      $compile('<input type="password" ng-model="password" zxcvbn="myExtrasArray">')($rootScope);
      $rootScope.$digest();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toEqual($rootScope.myExtrasArray);
      expect($rootScope.zxcvbnExtras).toContain(oldUsername);
      expect($rootScope.zxcvbnExtras.length).toBe(2);

      $rootScope.myExtrasArray = ['test@example.com', newUsername];
      $rootScope.$digest();

      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toEqual($rootScope.myExtrasArray);
      expect($rootScope.zxcvbnExtras).toContain(newUsername);
      expect($rootScope.zxcvbnExtras.length).toBe(2);
    });

    it('should detect when an element been added and recall zxcvbn with the added element too', function () {
      $rootScope.myExtrasArray = ['test@example.com', 'jon_skeet'];
      $rootScope.password = 'password';
      $compile('<input type="password" ng-model="password" zxcvbn="myExtrasArray">')($rootScope);
      $rootScope.$digest();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toEqual($rootScope.myExtrasArray);
      expect($rootScope.zxcvbnExtras.length).toBe(2);

      $rootScope.myExtrasArray = ['test@example.com', 'jon_skeet', '123 buckingham palace'];
      $rootScope.$digest();

      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toEqual($rootScope.myExtrasArray);
      expect($rootScope.zxcvbnExtras.length).toBe(3);
    });

    it('should detect when an element has been removed and recall zxcvbn without that element', function () {
      $rootScope.myExtrasArray = ['test@example.com', 'jon_skeet', '123 buckingham palace'];
      $rootScope.password = 'password';
      $compile('<input type="password" ng-model="password" zxcvbn="myExtrasArray">')($rootScope);
      $rootScope.$digest();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toEqual($rootScope.myExtrasArray);
      expect($rootScope.zxcvbnExtras.length).toBe(3);

      $rootScope.myExtrasArray = ['test@example.com', 'jon_skeet'];
      $rootScope.$digest();

      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.zxcvbnExtras);
      expect($rootScope.zxcvbnExtras).toEqual($rootScope.myExtrasArray);
      expect($rootScope.zxcvbnExtras.length).toBe(2);
    });
  });

  describe('with form and minScore attribute', function () {

    function minScoreValidationTestHelper(minScoreValue) {
      it('should set the password form property to invalid when min-score attribute it passed with a number greater than zxcvbn.score', function () {
        var minScoreForm =
          '<form name="myForm">' +
          '  <input type="email" ng-model="email" name="emailAddress">' +
          '  <input type="password" ng-model="password" name="password" zxcvbn="myForm" zxcvbn-min-score="' + minScoreValue + '">' +
          '</form>';

        $rootScope.password = 'password';
        $compile(minScoreForm)($rootScope);
        $rootScope.$digest();

        // The mock at the top sets zxcvbn.score to 2.
        // So when the min-score attr is higher than 2 the form should be invalid
        var invalid = minScoreValue > 2;
        expect($rootScope.myForm.password.$invalid).toBe(invalid);
      });
    }

    for (var i = 0; i < 5; i++) {
      minScoreValidationTestHelper(i);
    }


    var invalidMinScoreValues = [
      '-1',
      '1.1',
      '5',
      'two',
      'hello',
      ''
    ];

    function minScoreInvalidValuesTestHelper(minScoreValue) {
      it('should assume a min score of 0 when an invalid value is passed to the zxcvbn-min-score attribute', function() {
        var minScoreForm =
          '<form name="myForm">' +
          '  <input type="email" ng-model="email" name="emailAddress">' +
          '  <input type="password" ng-model="password" name="password" zxcvbn="myForm" zxcvbn-min-score="' + minScoreValue + '">' +
          '</form>';

        $rootScope.password = 'password';
        $compile(minScoreForm)($rootScope);
        $rootScope.$digest();

        expect($rootScope.myForm.password.$invalid).toBeFalsy();
      });
    }

    for(var j = 0; j < invalidMinScoreValues.length; j++) {
      minScoreInvalidValuesTestHelper(invalidMinScoreValues[j]);
    }

    it('should detect when a scope property is passed and read its value for the minimum score comparison', function() {
      $rootScope.minScore = 2;
      var minScoreForm =
        '<form name="myForm">' +
        '  <input type="email" ng-model="email" name="emailAddress">' +
        '  <input type="password" ng-model="password" name="password" zxcvbn="myForm" zxcvbn-min-score="minScore">' +
        '</form>';

      $rootScope.password = 'password';
      $compile(minScoreForm)($rootScope);
      $rootScope.$digest();

      expect($rootScope.myForm.password.$invalid).toBeFalsy();
      expect($rootScope.zxcvbnMinScore).toEqual($rootScope.minScore);
    });

    it('should dectect when a passed in scope variable changes and re-validate', function() {
      $rootScope.minScore = 2;
      var minScoreForm =
        '<form name="myForm">' +
        '  <input type="email" ng-model="email" name="emailAddress">' +
        '  <input type="password" ng-model="password" name="password" zxcvbn="myForm" zxcvbn-min-score="minScore">' +
        '</form>';
      $rootScope.password = 'password';
      $compile(minScoreForm)($rootScope);
      $rootScope.$digest();
      expect($rootScope.myForm.password.$invalid).toBeFalsy();
      expect($rootScope.zxcvbnMinScore).toEqual($rootScope.minScore);

      $rootScope.minScore = 3;
      $rootScope.$digest();

      expect($rootScope.myForm.password.$invalid).toBeTruthy();
      expect($rootScope.zxcvbnMinScore).toEqual($rootScope.minScore);
    });

    // valid ones = 0,1,2,3,4, 1.7
    // invaild = -1, 5, 2000, 'three', empty string
    // should set the field to invalid myForm.password.$invalid = true
    // when the minScoreField changes
    // should be able to use scope variables as well

  });

});