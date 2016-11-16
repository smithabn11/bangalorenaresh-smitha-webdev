/**
 * Created by smitha on 11/4/16.
 */
module.exports = function (app, models) {

    app.get('/api/search', searchItem);

    function searchItem(req, res) {
        var query = req.query; //for query param
        console.log(query.item);
        res.send(200);

    }
}