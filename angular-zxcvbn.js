/* global zxcvbn */
//
// angular-zxcvbn
// ==============
//
(function () {
  'use strict';
  angular.module('zxcvbn', [])
  .directive('zxcvbn', function () {
    return {
      scope: {
        password: '=',
        extra: '=',
        full: '=?'
      },
      restrict: 'E',
      template: '{{ timeToCrack.crack_time_display }}',
      link: function (scope) {
        scope.$watch('password', function (newVal) {
          if (newVal) {
            if (scope.extra)
              scope.timeToCrack = zxcvbn(newVal, scope.extra);
            else
              scope.timeToCrack = zxcvbn(newVal);

            if (scope.full && scope.timeToCrack)
              scope.full = angular.copy(scope.timeToCrack);

          }
        });
      }
    };
  });

})();
