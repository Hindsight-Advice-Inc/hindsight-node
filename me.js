var uuid = require("uuid")
var neo = require("./neo.js")
var session = require("./session")

module.exports = function(app) {

	app.get("/me", session, function(req, res) {
		res.send(req.user)
	})

	app.post('/me', function (req, res){
		var input = req.body;
		if(!input.id){
			input.id = uuid.v4();
		}
		neo.cypher({
	    	query: 'MERGE (n:User {id :{id} }) SET n.email = {email}, n.name = {name}, n.story = {story}',
	    	params: input,
		}, function (err, results) {
		    if (err) throw err;
		    res.send(input);
		});
	});

	app.post("/me/modify/:prop", session, function(req, res) {
		var data = req.body.data;

		neo.cypher({
			query : "MATCH (n:User {id : {id} }) SET n." + req.params.prop + "={data} ",
			params : {
				data : data,
				id : req.user.id
			}
		}, function(err, results) {
			if(err) {
				res.status(500)
				res.send(err)
				return
			}

			res.send()
		})

	})

	app.post("/me/request/:user", session, function(req, res) {

		var params = req.input;
		params.rid = uuid.v4();
		params.me = session.user.id;
		params.tid = req.params.user;

		neo.cypher({
	    	query: 
	    		'MATCH (me:User { id : {me} } ), (target:User {id: {tid}} ) ' +
	    		'MERGE (r:Request { id : {rid}, paid : false, accepted : false, essay : {essay}, qa : {qa}, advice : {advice}, message : {message} } }) ' + 
	    		'CREATE UNIQUE (me)-[:CREATE_REQUEST]->(r)<-[:HAS_REQUEST]-(target)',
	    	params: params,
		}, function (err, results) {
		    if (err) {
		    	res.status(500);
		    	res.send(err)
		    }
		    res.send();
		});
	});

	app.post("/me/accept/:request", function(req, res){

		neo.cypher({
			query: 'MATCH (r:Request {id : {rid}}) SET r.accepted = true',
			params : {
				rid : req.params.request
			}
		}, function (err, results) {
			if(err) throw err;
			res.send("ok")
		})
	})

	app.post("/me/pay/:request", function(req, res){
		neo.cypher({
			query: 'MATCH (r:Request {id : {rid}}) SET r.paid = true',
			params : {
				rid : req.params.request
			}
		}, function (err, results) {
			if(err) throw err;
			res.send("ok")
		})
	})
}

