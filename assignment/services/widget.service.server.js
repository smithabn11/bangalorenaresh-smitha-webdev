/**
 * Created by smitha on 10/30/16.
 */
module.exports = function (app, models) {

    var multer = require('multer'); // npm install multer --save
    var upload = multer({dest: __dirname + '/../../public/assignment/uploads'});

    // var widgets =
    //     [
    //         {"_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
    //         {"_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
    //         {
    //             "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
    //             "url": "http://lorempixel.com/400/200/"
    //         },
    //         {"_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
    //         {"_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
    //         {
    //             "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
    //             "url": "https://youtu.be/AM2Ivdi9c4E"
    //         },
    //         {"_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    //     ];

    app.get("/api/user/:uid/website/:wid/page/:pid/widget", findWidgetsByPageId);
    app.get("/api/user/:uid/website/:wid/page/:pid/widget/:wgid", findWidgetById);
    app.post("/api/user/:uid/website/:wid/page/:pid/widget", createWidget);
    app.put("/api/user/:uid/website/:wid/page/:pid/widget/:wgid", updateWidget);
    app.delete("/api/user/:uid/website/:wid/page/:pid/widget/:wgid", deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);
    // app.put("/api/sort", sortWidget);
    app.put("/api/user/:uid/website/:wid/page/:pid/widget", reorderWidgets);

    var pageModel = models.pageModel;
    var widgetModel = models.widgetModel;

    function findWidgetsByPageId(req, res) {
        var pageId = req.params['pid'];

        widgetModel.findWidgetsByPageId(pageId)
            .then(
                function (widgets) {
                    res.json(widgets);
                },
                function (error) {
                    res.sendStatus(404);
                }
            );
    }

    function findWidgetById(req, res) {
        var widgetId = req.params['wgid'];

        widgetModel.findWidgetById(widgetId)
            .then(
                function (widget) {
                    if (widget != null) {
                        res.json(widget);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function createWidget(req, res) {
        var pageId = req.params['pid'];
        var newWidget = req.body;

        widgetModel.findNextDisplayOrder(pageId)
            .then(function (widget) {
                var nextDisplayOrder = 1;
                if (widget && widget.displayOrder) {
                    nextDisplayOrder = widget.displayOrder + 1;
                }
                newWidget.displayOrder = nextDisplayOrder;
                return nextDisplayOrder;
            }, function (err) {
                res.sendStatus(404);
            }).then(function (displayOrder) {
            widgetModel.createWidget(pageId, newWidget)
                .then(
                    function (widget) {
                        res.json(widget);
                        return widget;
                    },
                    function (error) {
                        res.sendStatus(404);
                    }
                ).then(
                function (widget) {
                    saveWidgetToPage(pageId, widget._id);
                },
                function (error) {
                    console.log("Error in creating widget " + widget.name);
                }
            )
        });
    }


    function saveWidgetToPage(pageId, widgetId) {
        pageModel.findPageById(pageId)
            .then(
                function (page) {
                    page.widgets.push(widgetId);
                    page.save();
                },
                function (error) {
                    console.log("Error to linking Widget to Page " + pageId);
                }
            );
    }

    function updateWidget(req, res) {
        var widgetUpdated = req.body;
        var widgetId = req.params['wgid'];
        widgetModel.updateWidget(widgetId, widgetUpdated)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update widget info");
                }
            );
    }

    function deleteWidget(req, res) {
        var widgetId = req.params['wgid'];
        widgetModel.findWidgetById(widgetId)
            .then(
                function (widget) {
                    removeWidgetFromPage(widget._page, widgetId);
                    return widgetId;
                },
                function (error) {
                    res.sendStatus(404);
                }
            ).then(
            function (widgetId) {
                widgetModel.deleteWidget(widgetId)
                    .then(
                        function (status) {
                            res.sendStatus(200);
                        },
                        function (error) {
                            res.sendStatus(404);
                        }
                    );
            }
        );
    }

    function removeWidgetFromPage(pageId, widgetId) {
        pageModel.findPageById(pageId)
            .then(
                function (page) {
                    var index = page.widgets.indexOf(widgetId);
                    if (idx > -1) {
                        page.widgets.splice(index, 1);
                        page.save();
                    }
                    else {
                        console.log("Widget  " + widgetId + " not found in Page " + page.name);
                    }
                },
                function (error) {
                    console.log("Error to removing Widget from Page " + pageId);
                }
            );
    }


    function uploadImage(req, res) {
        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var myFile = req.file;
        var originalname = myFile.originalname; // file name on user's computer
        var filename = myFile.filename;     // new file name in upload folder
        var path = myFile.path;         // full path of uploaded file
        var destination = myFile.destination;  // folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;
        res.send(myFile);
    }

    // function sortWidget(req, res) {
    //     var start = req.query.start;
    //     var end = req.query.end;
    //     widgets.splice(end, 0, widgets.splice(start, 1)[0]);
    //     res.send(200);
    // }

    function reorderWidgets(req, res) {
        var pageId = req.params['pid'];
        var start = req.query.start;
        var end = req.query.end;
        widgetModel
            .reorderWidgets(pageId, start, end)
            .then(function (widgets) {
                res.sendStatus(200);
            });
    }
}