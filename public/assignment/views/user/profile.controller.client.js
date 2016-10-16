/**
 * Created by smitha on 10/13/16.
 */
(function () {
    angular.module('WebAppMaker')
        .controller('ProfileController', ProfileController);


    function ProfileController($routeParams, UserService) {
        var vm = this;

        var userId = $routeParams.uid;

        var user = UserService.findUserById(userId);

        if(user != null) {
            vm.user = user;
        }

    }
})();