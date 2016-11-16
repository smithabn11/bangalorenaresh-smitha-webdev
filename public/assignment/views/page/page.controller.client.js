/**
 * Created by smitha on 10/16/16.
 */
(function () {
    angular.module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];

        function init() {

            var promise = PageService.findPageByWebsiteId(userId, websiteId);
            promise
                .success(function (pages) {
                    vm.pages = pages;
                    vm.userId = userId;
                    vm.websiteId = websiteId;
                })
                .error(function (response) {
                    vm.error = response;
                    console.log(response);
                });
        }

        init();

    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];

        vm.userId = userId;
        vm.websiteId = websiteId;
        vm.createPage = createPage;

        function createPage(websiteId, pageName, pageTitle, userId) {
            var newpage = {
                // _id: (new Date()).getTime() + "",
                "name": pageName,
                "websiteId": websiteId,
                "title": pageTitle
            };
            if (newpage != null) {
                PageService.createPage(userId, websiteId, newpage)
                    .success(function (page) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page");
                    })
                    .error(function (response) {
                        vm.error = response;
                        console.log(response);
                    });
            }
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];
        var pageId = $routeParams['pid'];

        function init() {
            var promise = PageService.findPageById(userId, websiteId, pageId);

            promise
                .success(function (page) {
                    if (page != '0') {
                        vm.page = page;
                        vm.userId = userId;
                        vm.websiteId = websiteId;
                        vm.updatePage = updatePage;
                        vm.deletePage = deletePage;
                    }
                })
                .error(function (response) {
                    vm.error = response;
                    console.log(response);
                });
        }

        init();

        function updatePage(page) {
            if (page != null) {
                PageService.updatePage(vm.userId, vm.websiteId, page._id, page)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    })
                    .error(function () {
                        vm.error = response;
                        console.log(response);
                    });
            }

        }

        function deletePage(pageId) {
            if (pageId != null) {
                PageService.deletePage(vm.userId, vm.websiteId, pageId)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    })
                    .error(function (response) {
                        vm.error = response;
                        console.log(response);
                    });
            }
        }
    }
})();