(function () {
  'use strict';

  // Don't include any dependent modules here - include them in the element directive source code
  angular.module('zxcvbn')
    .directive('zxcvbn', function () {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {

          /**
           * Runs the zxcvbn algorithm with the scope variables: "zxcvbnPassword", "zxcvbnExtras".
           * Then assigns the result to "scope.zxcvbn".
           */
          scope.runZxcvbn = function () {
            if (angular.isUndefined(scope.zxcvbnPassword)) {
              console.log('Cant run zxcvbn because the password is not defined in the scope.');
              return;
            }

            if (angular.isDefined(scope.zxcvbnExtras) && scope.zxcvbnExtras.length > 0) {
              scope.zxcvbn = zxcvbn(scope.zxcvbnPassword, scope.zxcvbnExtras);
            } else {
              scope.zxcvbn = zxcvbn(scope.zxcvbnPassword);
            }
          };


          /**
           * Checks if the given object is a form.
           */
          scope.isForm = function (value) {
            try {
              return Object.getPrototypeOf(value).constructor.name === 'FormController';
            } catch (error) {
              return false;
            }
          };


          /**
           *  Watches scope.zxcvbnExtras - under the assumption it is a form object.
           *
           *  A form object is constructed by giving using "<form>" and then giving it the attribute 'name'.
           *  This name is then assigned to the scope as a property. Next any controls are also given
           *  the attributes 'ng-model' and 'name' which attaches them to the form object as properties.
           *  Example:
           *    <form name="loginForm">
           *      <input type="email" name="emailAddress" ng-model="email">
           *      <input type="password" name="password" ng-model="password">
           *    </form>
           *
           *    This gives arise to the following scope variables:
           *      - scope.loginForm
           *      - scope.loginForm.emailAddress
           *      - scope.loginForm.password
           *
           *  This method finds extra fields (such as emailAddress in the example above) and then passes
           *  them to the zxcvbn algorithm. Note: will ignore angular properties (those starting with "$")
           *  and default javascript properties (those starting with "__").
           */
          scope.zxcvbnFormWatcher = function (extrasPropertyName) {
            var form = scope[extrasPropertyName];
            console.assert(scope.isForm(form));

            scope.zxcvbnExtrasWatcher = scope.$watch(function () {
              var extrasArray = [];
              // Doesn't start with "$" or "__"
              var validPropertyRegex = new RegExp('^(?!\\$|__)');
              for (var prop in form) {
                // Property's containing the string "password" should also be ignored
                if (validPropertyRegex.test(prop) && prop.toLowerCase().indexOf('password') === -1) {
                  extrasArray.push(scope[extrasPropertyName][prop].$viewValue);
                }
              }
              return extrasArray;
            }, function (newValue) {
              scope.zxcvbnExtras = [];
              // Only pass strings
              for (var i = 0; i < newValue.length; i++) {
                if (angular.isString(newValue[i])){
                  scope.zxcvbnExtras.push(newValue[i]);
                }
              }
              ngModelCtrl.$validate();
            }, true);
          };


          /**
           *  Watches scope.zxcvbnExtras - under the assumption it is an array.
           *  If the array changes (deep check) then the zxcvbn algorithm will be re-run
           *  with the updated extras data.
           */
          scope.zxcvbnArrayWatcher = function (extrasPropertyName) {
            scope.zxcvbnExtrasWatcher = scope.$watch(function () {
              return scope[extrasPropertyName];
            }, function (newValue) {
              scope.zxcvbnExtras = newValue;
              ngModelCtrl.$validate();
            }, true);
          };


          /**
           *  Clears the current extras watcher (if there is one) and then attempts to
           *  create a new one via a scope property. This property can be either an array
           *  or a form.
           */
          scope.setZxcvbnExtrasWatcher = function (extrasPropertyName) {
            var extras = scope[extrasPropertyName];

            // Clear the current watcher if there is one
            if (angular.isFunction(scope.zxcvbnExtrasWatcher)) {
              scope.zxcvbnExtrasWatcher();
            }
            scope.zxcvbnExtrasWatcher = undefined;
            scope.zxcvbnExtras = undefined;

            if (angular.isDefined(extras)) {
              if (angular.isArray(extras)) {
                scope.zxcvbnArrayWatcher(extrasPropertyName);
              } else if (scope.isForm(extras)) {
                scope.zxcvbnFormWatcher(extrasPropertyName);
              }
            }
          };


          // Initially set the extras watcher
          scope.setZxcvbnExtrasWatcher(attrs.zxcvbn);

          // Set the password validator and also run the zxcvbn algorithm on password change
          ngModelCtrl.$validators.passwordStrength = function(value) {
            var minScore = parseInt(scope.zxcvbnMinScore);
            minScore = (isNaN(minScore) || minScore < 0 || minScore > 4) ? 0 : minScore;
            scope.zxcvbnPassword = value;
            scope.runZxcvbn();
            return minScore <= scope.zxcvbn.score;
          };


          attrs.$observe('zxcvbn', function() {
            scope.setZxcvbnExtrasWatcher(attrs.zxcvbn);
            ngModelCtrl.$validate();
          });


          attrs.$observe('zxcvbnMinScore', function(value) {
            // Clear the current watcher if there is one
            if (angular.isFunction(scope.zxcvbnMinScoreWatcher)) {
              scope.zxcvbnMinScoreWatcher();
            }
            scope.zxcvbnMinScoreWatcher = undefined;
            scope.zxcvbnMinScore = undefined;

            // Note: save the validation of the scope.zxcvbnMinScore in the actual validator, i.e. if it is a number of not

            // If the value passed in is a scope property then watch that property for changes
            if (angular.isDefined(scope[value])) {
              scope.zxcvbnMinScore = scope[value];

              scope.zxcvbnMinScoreWatcher = scope.$watch(value, function(newValue) {
                scope.zxcvbnMinScore = newValue;
                ngModelCtrl.$validate();
              });

            } else {
              // Otherwise just attempt to read
              scope.zxcvbnMinScore = value;
            }

            ngModelCtrl.$validate();
          });

        }
      };
    });
})();
