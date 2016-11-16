/**
 * Created by smitha on 10/24/16.
 */

module.exports = function(app) {
    var models = require("./models/models.server")();
    require("./services/shopper.service.server.js")(app, models);
    require("./services/search.service.server.js")(app, models);
};