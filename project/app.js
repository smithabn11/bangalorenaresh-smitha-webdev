/**
 * Created by smitha on 10/24/16.
 */

module.exports = function(app) {
    var models = require("./models/models.server")();
    require("./services/shopper.service.server.js")(app, models);
    require("./services/shoppingcart.service.server.js")(app, models);
    require("./services/wishlist.service.server.js")(app, models);
};