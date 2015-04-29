var express = require('express');
var parser = require("body-parser");
var app = express();
app.use(parser.json())
var solr = require('solr-client');
var client = solr.createClient({
	
});
client.autoCommit = true;

var uuid = require("uuid");

app.post('/advisor', function (req, res){

	var input = req.body;
	if(!input.id){
		input.id = uuid.v4();
	}

	client.add(input, function(err,obj){
		if(err){
			console.log(err);
		}
		else{
			console.log('Solr response:', obj);
			client.commit();
		}
	})

	res.send("ok");
});



app.get('/', function (req, res) {
	var result = {
		name : req.query.message,
		date : new Date(),
	}
  res.send(result);
}); 

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
