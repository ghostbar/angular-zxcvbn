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
        link: function (scope) {
          scope.$watch('password', function (newVal) {
            if (angular.isString(newVal)) {

              if (scope.extras)
                scope.timeToCrack = zxcvbn(newVal, scope.extras);
              else
                scope.timeToCrack = zxcvbn(newVal);

              if (scope.data && scope.timeToCrack)
                scope.data = angular.copy(scope.timeToCrack);

              scope.display = angular.copy(scope.timeToCrack);
            }
          });
        }
      };
    });

})();
