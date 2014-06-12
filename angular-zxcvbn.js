/* global zxcvbn */
//
// angular-zxcvbn
// ==============
//
(function () {
  'use strict';

  angular.module('angular-zxcvbn', [])

  .directive('zxcvbn', function () {
    return {
      scope: {
        password: '=',
        extra: '='
      },
      restrict: 'E',
      template: '{{ timeToCrack.crack_time_display }}',
      link: function (scope) {
        scope.$watch('password', function (newVal) {
          if (newVal) {
            if (scope.extra != null)
              scope.timeToCrack = zxcvbn(scope.password, scope.extra);
            else
              scope.timeToCrack = zxcvbn(scope.password);
          }
        });
      }
    };
  });

})();
