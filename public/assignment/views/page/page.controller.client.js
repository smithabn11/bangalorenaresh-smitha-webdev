/**
 * Created by smitha on 10/16/16.
 */
(function () {
    angular.module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        console.log("In PageListController");
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];

        var pages = PageService.findPageByWebsiteId(websiteId);

        if (pages != null) {
            vm.pages = pages;
            vm.userId = userId;
            vm.websiteId = websiteId;
        }
    }

    function NewPageController($routeParams, PageService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];

        vm.userId = userId;
        vm.websiteId = websiteId;


    }

    function EditPageController($routeParams, PageService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];


        vm.userId = userId;
        vm.websiteId = websiteId;
    }
})();