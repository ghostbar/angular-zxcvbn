(function () {
  'use strict';
  angular.module('zxcvbn', [])
    .directive('zxcvbn', function () {
      return {
        scope: {
          password: '=',
          extras: '=?',
          data: '=?'
        },
        restrict: 'E',
        template: '{{ display.crack_times_display }}',
        link: function (scope, element, attrs) {
          scope.$watch('password', function (newVal) {
            if (angular.isString(newVal)) {

              if (scope.extras)
                scope.timeToCrack = zxcvbn(newVal, scope.extras);
              else
                scope.timeToCrack = zxcvbn(newVal);

              if (('data' in attrs) && scope.timeToCrack)
                scope.data = angular.copy(scope.timeToCrack);

              scope.display = angular.copy(scope.timeToCrack);
            }
          });
        }
      };
    });

})();

(function () {
  'use strict';

  // Don't include any dependent modules here - include them in the element directive source code
  angular.module('zxcvbn')
    .directive('zxcvbn', function () {
      return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
          zxResult: '=?zxcvbn',
          zxExtras: '=?',
          zxMinScore: '@?'
        },
        link: function (scope, element, attrs, ngModelCtrl) {

          /**
           * Runs the zxcvbn algorithm with the scope variables: "zxPassword", "zxExtras".
           * Then assigns the result to "scope.zxResults".
           */
          scope.runZxcvbn = function () {
            if (angular.isUndefined(scope.zxPassword)) {
              scope.zxPassword = '';
            }

            if (angular.isDefined(scope.zxExtrasArray) && scope.zxExtrasArray.length > 0) {
              scope.zxResult = zxcvbn(scope.zxPassword, scope.zxExtrasArray);
            } else {
              scope.zxResult = zxcvbn(scope.zxPassword);
            }
          };

          scope.isForm = function (value) {
            try {
              return Object.getPrototypeOf(value).constructor.name === 'FormController';
            } catch (error) {
              return false;
            }
          };

          /**
           *  Clears the current extras watcher (if there is one) and then attempts to
           *  create a new one via a scope property. This property can be either an array
           *  or a form.
           */
          scope.setZxExtrasWatcher = function () {
            var extras = scope.zxExtras;

            // Clear the current watcher if there is one
            if (angular.isFunction(scope.zxExtrasWatcher)) {
              scope.zxExtrasWatcher();
            }
            scope.zxExtrasWatcher = undefined;

            if (angular.isDefined(extras)) {
              if (angular.isArray(extras)) {
                scope.zxArrayWatcher();
              } else if (scope.isForm(extras)) {
                scope.zxFormWatcher();
              }
            }
          };

          /**
           *  Watches scope.zxExtras - under the assumption it is a form object.
           *
           *  This method finds extra fields in forms and then pass them to the zxcvbn algorithm. Note: will ignore angular properties
           *  (those starting with "$") and default javascript properties (those starting with "__").
           */
          scope.zxFormWatcher = function () {
            var form = scope.zxExtras;
            console.assert(scope.isForm(form), 'zx-extras element is some how not a form.');

            scope.zxExtrasWatcher = scope.$watch(function () {
              var extrasArray = [];
              // Doesn't start with "$" or "__"
              var validPropertyRegex = new RegExp('^(?!\\$|__)');
              for (var prop in form) {
                // Property's containing the string "password" should also be ignored
                if (validPropertyRegex.test(prop) && form[prop].hasOwnProperty('$viewValue') && prop.toLowerCase().indexOf('password') === -1) {
                  extrasArray.push(form[prop].$viewValue);
                }
              }
              return extrasArray;
            }, function (newValue) {
              scope.zxExtrasArray = [];
              // Only pass strings
              for (var i = 0; i < newValue.length; i++) {
                if (angular.isString(newValue[i])) {
                  scope.zxExtrasArray.push(newValue[i]);
                }
              }
              ngModelCtrl.$validate();
            }, true);
          };

          /**
           *  Watches scope.zxExtras - under the assumption it is an array.
           *  If the array changes (deep check) then the zxcvbn algorithm will be re-run
           *  with the updated extras data.
           */
          scope.zxArrayWatcher = function () {
            scope.zxExtrasWatcher = scope.$watch('zxExtras', function (newValue) {
              scope.zxExtrasArray = newValue;
              ngModelCtrl.$validate();
            }, true);
          };

          // Initially set the extras watcher
          scope.setZxExtrasWatcher();

          // Set the password validator and also run the zxcvbn algorithm on password change
          ngModelCtrl.$validators.passwordStrength = function (value) {
            var minScore = parseInt(scope.zxMinScore);
            minScore = (isNaN(minScore) || minScore < 0 || minScore > 4) ? 0 : minScore;
            scope.zxPassword = value;
            scope.runZxcvbn();
            return minScore <= scope.zxResult.score;
          };


          attrs.$observe('zxExtras', function () {
            scope.setZxExtrasWatcher();
            ngModelCtrl.$validate();
          });


          attrs.$observe('zxMinScore', function (value) {
            scope.zxMinScore = value;
            ngModelCtrl.$validate();
          });

        }
      };
    });
})();
