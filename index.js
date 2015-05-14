var express = require('express');
var parser = require("body-parser");
var app = express();
app.use(parser.json())


var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo-2.ironbay.digital');
console.log(db)
db.cypher({
    query: 'MATCH (u:User {email: {email}}) RETURN u',
    params: {
        email: 'alice@example.com',
    },
}, function (err, results) {
    if (err) throw err;
    var result = results[0];
    if (!result) {
        console.log('No user found.');
    } else {
        var user = result['u'];
        console.log(JSON.stringify(user, null, 4));
    }
});

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

app.post('/auth/login', function (req, res){


})

app.post('/auth/logout', function (req, res){


})

app.get('/me', function (req, res){

	
})

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
var express = require('express');
var parser = require("body-parser");
var app = express();
app.use(parser.json())


var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo-2.ironbay.digital');
var node = db.createNode({hello: 'world'});     // instantaneous, but...
node.save(function (err, node) {    // ...this is what actually persists.
    if (err) {
        console.error('Error saving new node to database:', err);
    } else {
        console.log('Node saved to database with id:', node.id);
    }
});

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

app.post('/auth/login', function (req, res){


})

app.post('/auth/logout', function (req, res){


})

app.get('/me', function (req, res){

	
})

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
