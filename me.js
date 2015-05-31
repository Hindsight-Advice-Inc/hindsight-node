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

	app.post("/me/event", session, function(req,res) {
		var input = req.body;

		neo.cypher({
			query :
				'MATCH (u:User {id : {user} }) ' +
				'CREATE (e:Event { title : {title}, description : {description}, type : {type} }) ' +
				'CREATE  (u)-[:HAS_EVENT]->(e) ',
			params : {
				title : input.title,
				description : input.description,
				type : input.type,
				user : req.user.id
			}
		}, function(err, results) {
			if(err){
				res.status(500)
				res.send(err)
			}
			res.send(input)
		})

	})

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

