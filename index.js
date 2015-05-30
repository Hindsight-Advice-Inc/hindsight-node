var express = require('express');
var parser = require("body-parser");
var app = express();
app.use(parser.json())
app.use(require("cors")())

require("./me.js")(app)
require("./auth.js")(app)
require("./advisor.js")(app)

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});