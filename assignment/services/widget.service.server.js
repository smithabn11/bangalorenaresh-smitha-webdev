/**
 * Created by smitha on 10/30/16.
 */
module.exports = function (app) {

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest:  __dirname+'/../../public/assignment/uploads' });

    var widgets =
        [
            {"_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
            {"_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            {
                "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/"
            },
            {"_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
            {"_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            {
                "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/AM2Ivdi9c4E"
            },
            {"_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
        ];

    app.get("/api/user/:uid/website/:wid/page/:pid/widget", findWidgetsByPageId);
    app.get("/api/user/:uid/website/:wid/page/:pid/widget/:wgid", findWidgetById);
    app.post("/api/user/:uid/website/:wid/page/:pid/widget", createWidget);
    app.put("/api/user/:uid/website/:wid/page/:pid/widget/:wgid", updateWidget);
    app.delete("/api/user/:uid/website/:wid/page/:pid/widget/:wgid", deleteWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.put("/api/sort", sortWidget);

    function findWidgetsByPageId(req, res) {
        var pageId = req.params['pid'];
        var result = [];
        for (var w in widgets) {
            if (widgets[w].pageId == pageId) {
                result.push(widgets[w]);
            }
        }
        res.json(result); //helps to skip over the type of data in content type. more explicit
    }

    function findWidgetById(req, res) {
        var widgetId = req.params['wgid'];
        for (var w in widgets) {
            if (widgets[w]._id == widgetId) {
                res.send(widgets[w]);
                return;
            }
        }
        res.send('0');
    }

    function createWidget(req, res) {
        var widget = req.body;
        widgets.push(widget);
        res.send(200);
    }

    function updateWidget(req, res) {
        var widgetUpdated = req.body;
        var widgetId = req.params['wgid'];

        for (var w in widgets) {
            if (widgets[w]._id == widgetId) {
                widgets[w] = widgetUpdated;
            }
        }
        res.send(200); //just update successfully
    }

    function deleteWidget(req, res) {
        var widgetId = req.params['wgid'];

        for (var w in widgets) {
            if (widgets[w]._id == widgetId) {
                widgets.splice(w, 1);
            }
        }
        res.send(200);
    }


    function uploadImage(req, res) {
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;
        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;
        res.send(myFile);
    }

    function sortWidget(req, res) {
        var start = req.query.start;
        var end = req.query.end;
        widgets.splice(end, 0, widgets.splice(start, 1)[0]);
        res.send(200);
    }
}