/**
 * Created by smitha on 10/13/16.
 */
(function () {
    angular.module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        console.log("In WebsiteListController");
        var vm = this;

        var userId = $routeParams['uid'];

        var websites = WebsiteService.findWebsitesByUser(userId);

        if (websites != null) {
            vm.websites = websites;
            vm.userId = websites[0].developerId;
        }

    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;

        var userId = $routeParams['uid'];

        var websites = WebsiteService.findWebsitesByUser(userId);

        if (websites != null) {
            vm.websites = websites;
            vm.userId = userId;
            vm.createWebsite = createWebsite;
        }

        function createWebsite(sitename, description, userId) {
            var website = {"_id": "100", "name": sitename, "developerId": userId, "description": description};
            if (website != null) {
                WebsiteService.createWebsite(userId, website);
            }
            $location.url("/user/" + userId + "/website");
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        console.log("In EditWebsiteController");
        var vm = this;

        var userId = $routeParams['uid'];
        var wid = $routeParams['wid'];

        var website = WebsiteService.findWebsiteById(wid);
        var websites = WebsiteService.findWebsitesByUser(userId);

        if (website != null) {
            vm.website = website;
            vm.websites = websites;
            vm.userId = userId;
            vm.updateWebsite = updateWebsite;
            vm.deleteWebsite = deleteWebsite;
        }

        function updateWebsite(websiteId, websiteName, websiteDescription, userId) {
            var website = WebsiteService.findWebsiteById(wid);

            if (website != null) {
                website.name = websiteName;
                website.description = websiteDescription;
                WebsiteService.updateWebsite(websiteId, website);
            }
            $location.url("/user/" + userId + "/website");
        }

        function deleteWebsite(websiteId, userId) {
            var website = WebsiteService.findWebsiteById(websiteId);
            if (website != null) {
                WebsiteService.deleteWebsite(websiteId);
            }
            $location.url("/user/" + userId + "/website");
        }
    }


})();