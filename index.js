var express = require('express');
var parser = require("body-parser");
var app = express();
app.use(parser.json())


var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo-2.ironbay.digital');


var solr = require('solr-client');
var client = solr.createClient({
	
});
client.autoCommit = true;


var uuid = require("uuid");

app.post('/me', function (req, res){
	var input = req.body;
	if(!input.id){
		//input.id = uuid.v4();
		input.id = "123";
	}
	console.log(input)
	db.cypher({
    	query: 'MERGE (n:User {id :{id} }) SET n.email = {email}, n.name = {name}',
    	params: {
        	id: input.id,
        	email: input.email,
        	name: input.name,
    	},
	}, function (err, results) {
	    if (err) throw err;
	    res.send(input);
	});
});

app.post("/me/request/:user", function(req, res) {

	db.cypher({
    	query: 
    		'MATCH (me:User { id : {me} } ), (target:User {id: {tid}} ) ' +
    		'MERGE (r:Request { id : {rid}, paid : false, accepted : false }) ' + 
    		'CREATE UNIQUE (me)-[:CREATE_REQUEST]->(r)<-[:HAS_REQUEST]-(target)',
    	params: {
        	rid: uuid.v4(),
        	me : "123",
        	tid : "456"
    	},
	}, function (err, results) {
	    if (err) throw err;
	    res.send("ok");
	});
});

app.post("/me/accept/:request", function(req, res){

	db.cypher({
		query: 'MATCH (r:Request {id : {rid}}) SET r.accepted = true',
		params : {
			rid : "bf7ff0a4-e067-46b1-9c5e-c189e92ce848"
		}
	}, function (err, results) {
		if(err) throw err;
		res.send("ok")
	})
})

app.post("/me/pay/:request", function(req, res){
	db.cypher({
		query: 'MATCH (r:Request {id : {rid}}) SET r.paid = true',
		params : {
			rid : "bf7ff0a4-e067-46b1-9c5e-c189e92ce848"
		}
	}, function (err, results) {
		if(err) throw err;
		res.send("ok")
	})
})

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