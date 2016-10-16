/**
 * Created by smitha on 10/16/16.
 */
(function () {
    angular.module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);


    function WidgetListController($routeParams, WidgetService) {
        console.log("In WidgetListController");
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];
        var pageId = $routeParams['pid'];

        var widgets = WidgetService.findWidgetsByPageId(pageId);

        if(widgets != null) {
            vm.widgets = widgets;
            vm.userId = userId;
            vm.websiteId = websiteId;
            vm.pageId = pageId;
        }

    }
})();