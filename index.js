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
			res.send(err)
		}
		else{
			client.commit();
		}

		res.send(input);
	})

});


app.get('/advisor/search', function (req, res){

	var query = client.createQuery().q(req.query.query);
	console.log(query)
	client.search(query,function(err,obj){
		if (err) {
			res.send(err);
			return;
		}
		res.send(obj.response.docs);
	})
})

app.get('/advisor/:id', function (req, res){
	var id = req.param('id');
	var query = client.createQuery().q('id:' + id);
	client.search(query,function(err, obj){
		res.send(obj.response.docs[0]);

	})
})

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
