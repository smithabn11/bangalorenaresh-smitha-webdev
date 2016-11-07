/**
 * Created by smitha on 10/31/16.
 */
(function () {
    angular.module("utility", [])
        .directive("sortable", sortable); //sortable

    function sortable() {
        cursor: 'move';

        function linker(scope, element, attributes) {
            var start1 = -1;
            var end1 = -1;
            element.sortable({
                start: function (event, ui) {
                    start1 = $(ui.item).index();
                },
                stop: function (event, ui) {
                    end1 = $(ui.item).index();
                    scope.sortableController.sort(start1, end1);
                }
            });
        }

        return {
            scope: {},
            restrict: 'CEA',
            link: linker,
            controller: sortableController,
            controllerAs: 'sortableController'
        }
    }

    function sortableController(WidgetService) {
        var vm = this;
        vm.sort = sort;

        function sort(start, end) {
            WidgetService.sort(start, end);
        }
    }

})();