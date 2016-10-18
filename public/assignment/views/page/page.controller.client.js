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

        var pages = PageService.findPageByWebsiteId(websiteId);

        if (pages != null) {
            vm.pages = pages;
            vm.userId = userId;
            vm.websiteId = websiteId;
        }
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];

        vm.userId = userId;
        vm.websiteId = websiteId;

        vm.createPage = createPage;

        function createPage(websiteId, pageName, pageTitle, userId) {
            var newpage =  { "_id": "100", "name": pageName, "websiteId": websiteId, "title": pageTitle };
            if(newpage != null) {
                PageService.createPage(websiteId, newpage);
            }
            $location.url("/user/" + userId + "/website/" + websiteId + "/page");
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];
        var pageId = $routeParams['pid'];

        var page = PageService.findPageById(pageId);

        if (page != null) {
            vm.page = page;
            vm.userId = userId;
            vm.websiteId = websiteId;
            vm.updatePage = updatePage;
            vm.deletePage = deletePage;
        }

        function updatePage(pageId, websiteId, pageName, pageTitle, userId) {
            var page = PageService.findPageById(pageId);

            if (page != null) {
                page.name = pageName;
                page.title = pageTitle;
                PageService.updatePage(pageId, page);
            }
            $location.url("/user/" + userId + "/website/" + websiteId + "/page");
        }

        function deletePage(pageId, websiteId, userId) {
            var page = PageService.findPageById(pageId);

            if(page != null) {
                PageService.deletePage(pageId);
            }
            $location.url("/user/" + userId + "/website/" + websiteId + "/page");
        }
    }
})();