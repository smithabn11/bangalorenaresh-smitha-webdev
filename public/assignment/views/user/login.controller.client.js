/**
 * Created by smitha on 10/7/16.
 */
(function () {
    angular.module('WebAppMaker')
        .controller('LoginController', LoginController);

        function LoginController($scope) {
            $scope.hello = "Hello from LoginController";
        }

})();