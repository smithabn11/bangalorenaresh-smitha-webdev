/**
 * Created by smitha on 10/13/16.
 */
(function () {
    angular.module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, $http, WebsiteService) {

        var vm = this;
        var userId = $routeParams['uid'];

        var promise = WebsiteService.findWebsitesByUser(userId);
        promise
            .success(function (websites) {
                if (websites != null) {
                    vm.websites = websites;
                    vm.userId = userId;
                }
            })
            .error(function () {

            });
    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        var userId = $routeParams['uid'];


        var promise = WebsiteService.findWebsitesByUser(userId);
        promise
            .success(function (websites) {
                if (websites != null) {
                    vm.websites = websites;
                    vm.userId = userId;
                    vm.createWebsite = createWebsite;
                }
            })
            .error(function (response) {
                vm.error = response;
                console.log(response);
            });


        function createWebsite(sitename, description, userId) {

            if (sitename == null || sitename == "") {
                $('#websitename').addClass('has-error');
                vm.error = "Website Name cannot be empty"
            } else {
                vm.error = "";
                $('#websitename').removeClass('has-error');

                var newWebsite = {
                    // _id: (new Date()).getTime() + "",
                    "name": sitename,
                    "developerId": userId,
                    "description": description
                };
                if (newWebsite != null) {
                    WebsiteService.createWebsite(userId, newWebsite)
                        .success(function (website) {
                            if (website && website._id) {
                                $location.url("/user/" + userId + "/website");
                            } else {
                                vm.error = "Could not create Website";
                            }
                        })
                        .error(function (response) {
                            vm.error = response;
                        });
                }
            }
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var wid = $routeParams['wid'];

        function init() {
            var promise1 = WebsiteService.findWebsiteById(userId, wid);
            promise1.success(function (website) {
                if (website != '0') {
                    vm.website = website;
                }
            }).error(function (response) {
                vm.error = response;
                console.log(response);
            });

            var promise2 = WebsiteService.findWebsitesByUser(userId);
            promise2.success(function (websites) {
                if (websites != null) {
                    vm.websites = websites;
                }
            }).error(function (response) {
                vm.error = response;
                console.log(response);
            });

            vm.userId = userId;
            vm.updateWebsite = updateWebsite;
            vm.deleteWebsite = deleteWebsite;
        }

        init();

        function updateWebsite(website) {
            if (website != null) {
                if (website.name == null || website.name == "") {
                    $('#websitename').addClass('has-error');
                    vm.error = "Website Name cannot be empty"
                } else {
                    vm.error = "";
                    $('#websitename').removeClass('has-error');

                    WebsiteService.updateWebsite(vm.userId, website)
                        .success(function () {
                            $location.url("/user/" + vm.userId + "/website");
                        })
                        .error(function (response) {
                            vm.error = response;
                        });
                }
            }
        }

        function deleteWebsite(websiteId) {
            if (websiteId != null) {
                WebsiteService.deleteWebsite(vm.userId, websiteId)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website");
                    })
                    .error(function (response) {
                        vm.error = response;
                        console.log(response);
                    });
            }
        }
    }
})();