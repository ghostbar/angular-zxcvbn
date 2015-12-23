(function () {
  'use strict';
  angular.module('zxcvbn', [])
    .directive('zxcvbn', function () {
      return {
        scope: {
          password: '=',
          extras: '=?',
          full: '=?'
        },
        restrict: 'E',
        template: '{{ display.crack_times_display }}',
        link: function (scope) {
          scope.$watch('password', function (newVal) {
            if (angular.isString(newVal)) {

              if (scope.extras)
                scope.timeToCrack = zxcvbn(newVal, scope.extras);
              else
                scope.timeToCrack = zxcvbn(newVal);

              if (scope.full && scope.timeToCrack)
                scope.full = angular.copy(scope.timeToCrack);

              scope.display = angular.copy(scope.timeToCrack);
            }
          });
        }
      };
    });

})();
