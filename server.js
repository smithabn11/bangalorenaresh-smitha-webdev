var express = require('express');
var app = express();
var app1 = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

app1.use(bodyParser.json());
app1.use(bodyParser.urlencoded({extended: true}));
app1.use(express.static(__dirname + '/public'));

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// require ("./test/app.js")(app);
require("./assignment/app.js")(app);
require("./project/app.js")(app);

var port = process.env.PORT || 3000;

app.listen(port);
app1.listen(3001);


