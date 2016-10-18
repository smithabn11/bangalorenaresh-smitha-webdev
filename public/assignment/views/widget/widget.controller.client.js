/**
 * Created by smitha on 10/16/16.
 */
(function () {
    angular.module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);


    function WidgetListController($routeParams, WidgetService, $sce) {
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
            vm.checkSafeHtml = checkSafeHtml;
            vm.checkSafeYoutubeUrl = checkSafeYoutubeUrl;
        }

        function checkSafeHtml(html) {
            console.log(html);
            return $sce.trustAsHtml(html);
        }

        function checkSafeYoutubeUrl(url) {
            var parts = url.split('/');
            var id = parts[parts.length - 1];
            var finalUrl = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(finalUrl);
        }
    }

    function NewWidgetController($routeParams, WidgetService) {

    }

    function EditWidgetController($routeParams, WidgetService) {

    }
})();