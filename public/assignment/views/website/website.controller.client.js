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

        if(websites != null) {
            vm.websites = websites;
            vm.userId = websites[0].developerId;
        }

    }

    function NewWebsiteController($routeParams, WebsiteService) {
        var vm = this;

        var userId = $routeParams['uid'];

        var websites = WebsiteService.findWebsitesByUser(userId);

        if(websites != null) {
            vm.websites = websites;
            vm.userId = userId;
        }

    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        console.log("In EditWebsiteController");
        var vm = this;

        var userId = $routeParams['uid'];
        var wid = $routeParams['wid'];

        var website = WebsiteService.findWebsiteById(wid);
        var websites = WebsiteService.findWebsitesByUser(userId);

        if(website != null) {
            vm.website = website;
            vm.websites = websites;
            vm.userId = userId;
        }

        function updateWebsite(websiteId, websiteName, userId) {
            console.log("in updateWebsite " +  websiteName);
            //call function to update the website
            $location.url("/user/"+userId+"/website");
        }
    }



})();