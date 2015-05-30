var uuid = require("uuid")
var neo = require("./neo.js")

module.exports = function(app) {

	app.get("/me", function(req, res) {
		
	})

	app.post('/me', function (req, res){
		var input = req.body;
		if(!input.id){
			input.id = uuid.v4();
		}
		console.log(input)
		neo.cypher({
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

		neo.cypher({
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

		neo.cypher({
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
		neo.cypher({
			query: 'MATCH (r:Request {id : {rid}}) SET r.paid = true',
			params : {
				rid : "bf7ff0a4-e067-46b1-9c5e-c189e92ce848"
			}
		}, function (err, results) {
			if(err) throw err;
			res.send("ok")
		})
	})
}

