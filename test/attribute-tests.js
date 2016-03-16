'use strict';

describe('zxcvbn attribute directive', function () {
  var $compile, $rootScope;

  var exampleFormHtml =
    '  <form name="myForm">' +
    '  <input type="text" ng-if="showHidden" ng-model="hidden" name="hidden">' + // use ng-if as that removes the element all together
    '  <input type="email" ng-model="email" name="emailAddress">' +
    '  <input type="text" ng-model="username" name="username">' +
    '  <input type="password" ng-model="password" name="password" zxcvbn="passwordStrength" zx-extras="myForm">' +
    '  <input type="password" ng-model="confirmPassword" name="confirmPassword">' +
    '</form>';

  beforeEach(module('zxcvbn'));

  beforeEach(inject(
    function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      spyOn(window, 'zxcvbn').and.callFake(function (password, extras) {
        // With zxcvbn 4.2.0 we rely on it returning an object containing 'score' as a int property
        return {
          password: password,
          extras: extras,
          score: 2
        };
      });
    }
  ));

  it('should call the zxcvbn function when used with ng-model and attach the result to the given variable', function () {
    var password = 'password';
    $rootScope.password = password;
    $rootScope.passwordStrength = {};
    $compile('<input type="password" ng-model="password" zxcvbn="passwordStrength">')($rootScope);

    $rootScope.$digest();

    var actual = JSON.stringify($rootScope.passwordStrength);
    var expected = JSON.stringify(zxcvbn($rootScope.password));
    expect(actual).toEqual(expected);
    expect(window.zxcvbn).toHaveBeenCalledWith(password);
  });

  it('should fail to compile when used without ng-model', function () {
    $rootScope.password = 'password';
    $rootScope.zxcvbn = {};

    expect(function () {
        $compile('<input type="password" zxcvbn>')($rootScope);
      }
    ).toThrow();
  });

  it('should call the zxcvbn when the password changes', function () {
    var oldPassword = 'password';
    var newPassword = 'qwerty';
    $rootScope.password = oldPassword;
    $compile('<input type="password" ng-model="password" zxcvbn="passwordStrength">')($rootScope);
    $rootScope.$digest();

    var actual1 = JSON.stringify($rootScope.passwordStrength);
    var expected1 = JSON.stringify(zxcvbn(oldPassword));
    expect(actual1).toEqual(expected1);
    expect(window.zxcvbn).toHaveBeenCalledWith(oldPassword);

    $rootScope.password = angular.copy(newPassword);
    $rootScope.$digest();

    var actual2 = JSON.stringify($rootScope.passwordStrength);
    var expected2 = JSON.stringify(zxcvbn(newPassword));
    expect(actual2).toEqual(expected2);
    expect(window.zxcvbn).toHaveBeenCalledWith(newPassword);
  });

  describe('with extras attribute with form object', function () {
    it('should detect that a form object has been passed and add named fields as extras - but ignores password fields', function () {
      $rootScope.email = 'test@example.com';
      $rootScope.username = 'jonskeet';
      $rootScope.password = 'password';
      $rootScope.confirmPassword = 'wrong_password';
      $compile(exampleFormHtml)($rootScope);

      $rootScope.$digest();

      var actual = JSON.stringify($rootScope.passwordStrength);
      var expected = JSON.stringify(zxcvbn($rootScope.password, [$rootScope.email, $rootScope.username]));
      expect(actual).toEqual(expected);
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, [$rootScope.email, $rootScope.username]);
    });

    it('should not call the zxcvbn function with an empty extras array', function() {
      $rootScope.password = 'password';
      $compile(exampleFormHtml)($rootScope);

      $rootScope.$digest();

      var actual = JSON.stringify($rootScope.passwordStrength);
      var expected = JSON.stringify(zxcvbn($rootScope.password));
      expect(actual).toEqual(expected);
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password);
    });

    it('should only pass non-null extras variables', function() {
      $rootScope.username = { me: 'hello'}; // this will be converted to a string i.e '[object Object]'
      $rootScope.password = 'password';
      $compile(exampleFormHtml)($rootScope);

      $rootScope.$digest();

      var actual = JSON.stringify($rootScope.passwordStrength);
      var expected = JSON.stringify(zxcvbn($rootScope.password, ['[object Object]']));
      expect(actual).toEqual(expected);
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, ['[object Object]']);
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
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, [ $rootScope.email, oldUsername]);

      $rootScope.username = angular.copy(newUsername);
      $rootScope.$digest();

      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, [ $rootScope.email, newUsername]);
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
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, [$rootScope.email, $rootScope.username]);

      // Now show the element
      $rootScope.showHidden = true;
      $rootScope.$digest();
      expect($rootScope.myForm.hidden).toBeDefined();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, [$rootScope.email, $rootScope.username, $rootScope.hidden]);
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
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, [$rootScope.email, $rootScope.username, $rootScope.hidden]);

      // Now hide the element
      $rootScope.showHidden = false;
      $rootScope.$digest();
      expect($rootScope.myForm.hidden).toBeUndefined();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, [$rootScope.email, $rootScope.username]);
    });

  });

  describe('with extras attribute with array of strings', function () {

    it('should detect when a string array is passed and use them as an argument for the zxcvbn call', function () {
      $rootScope.myExtrasArray = ['john', 'skeet', 'mad_dog_john@hotmail.com'];
      $rootScope.password = 'password';
      $compile('<input type="password" ng-model="password" zxcvbn="passwordStrength" zx-extras="myExtrasArray">')($rootScope);
      $rootScope.$digest();

      var actual = JSON.stringify($rootScope.passwordStrength);
      var expected = JSON.stringify(zxcvbn($rootScope.password, $rootScope.myExtrasArray));
      expect(actual).toEqual(expected);
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.myExtrasArray);
    });

    it('should detect when an element in the array changes and recall zxcvbn', function () {
      var oldUsername = 'jon_skeet';
      var newUsername = 'chuck_norris';

      $rootScope.myExtrasArray = ['test@example.com', oldUsername];
      $rootScope.password = 'password';
      $compile('<input type="password" ng-model="password" zxcvbn="passwordStrength" zx-extras="myExtrasArray">')($rootScope);
      $rootScope.$digest();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.myExtrasArray);

      $rootScope.myExtrasArray = ['test@example.com', newUsername];
      $rootScope.$digest();

      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.myExtrasArray);
    });

    it('should detect when an element been added and recall zxcvbn with the added element too', function () {
      $rootScope.myExtrasArray = ['test@example.com', 'jon_skeet'];
      $rootScope.password = 'password';
      $compile('<input type="password" ng-model="password" zxcvbn="passwordStrength" zx-extras="myExtrasArray">')($rootScope);
      $rootScope.$digest();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.myExtrasArray);

      $rootScope.myExtrasArray = ['test@example.com', 'jon_skeet', '123 buckingham palace'];
      $rootScope.$digest();

      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.myExtrasArray);
    });

    it('should detect when an element has been removed and recall zxcvbn without that element', function () {
      $rootScope.myExtrasArray = ['test@example.com', 'jon_skeet', '123 buckingham palace'];
      $rootScope.password = 'password';
      $compile('<input type="password" ng-model="password" zxcvbn="passwordStrength" zx-extras="myExtrasArray">')($rootScope);
      $rootScope.$digest();
      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.myExtrasArray);

      $rootScope.myExtrasArray = ['test@example.com', 'jon_skeet'];
      $rootScope.$digest();

      expect(window.zxcvbn).toHaveBeenCalledWith($rootScope.password, $rootScope.myExtrasArray);
    });
  });

  describe('with form and minScore attribute', function () {

    function minScoreValidationTestHelper(minScoreValue) {
      it('should set the password form property to invalid when min-score attribute it passed with a number greater than zxcvbn.score', function () {
        var minScoreForm =
          '<form name="myForm">' +
          '  <input type="email" ng-model="email" name="emailAddress">' +
          '  <input type="password" ng-model="password" name="password" zxcvbn zx-extras="myForm" zx-min-score="' + minScoreValue + '">' +
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
          '  <input type="password" ng-model="password" name="password" zxcvbn zx-extras="myForm" zx-min-score="' + minScoreValue + '">' +
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

    it('should allow interpolated controller values', function() {
      $rootScope.minScore = 2;
      var minScoreForm =
        '<form name="myForm">' +
        '  <input type="email" ng-model="email" name="emailAddress">' +
        '  <input type="password" ng-model="password" name="password" zxcvbn zx-extras="myForm" zx-min-score="{{ minScore }}">' +
        '</form>';

      $rootScope.password = 'password';
      $compile(minScoreForm)($rootScope);
      $rootScope.$digest();

      expect($rootScope.myForm.password.$invalid).toBeFalsy();
    });

    it('should dectect when a passed in scope variable changes and re-validate', function() {
      $rootScope.minScore = 2;
      var minScoreForm =
        '<form name="myForm">' +
        '  <input type="email" ng-model="email" name="emailAddress">' +
        '  <input type="password" ng-model="password" name="password" zxcvbn zx-extras="myForm" zx-min-score="{{ minScore }}">' +
        '</form>';
      $rootScope.password = 'password';
      $compile(minScoreForm)($rootScope);
      $rootScope.$digest();
      expect($rootScope.myForm.password.$invalid).toBeFalsy();

      $rootScope.minScore = 3;
      $rootScope.$digest();

      expect($rootScope.myForm.password.$invalid).toBeTruthy();
    });

  });

});