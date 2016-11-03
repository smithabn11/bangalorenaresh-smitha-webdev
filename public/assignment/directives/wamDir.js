/**
 * Created by smitha on 10/31/16.
 */
(function () {
    angular.module("wamDirectives", [])
        .directive("wamSortable", wamSortable); //wam-sortable

    function wamSortable() {
        console.log("hello from wamSortable");
    }

})();