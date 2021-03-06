var uuid = require("uuid")
var neo = require("./neo.js")
var session = require("./session")

module.exports = function(app) {

	app.post("/me/event/school", session, function(req, res) {
		
		var input = req.body;
		input.user = req.user.id;
		input.id = uuid.v4();

		neo.cypher({
			query : 
				"MATCH (u:User {id : {user} }) " +
				"MERGE (s:School {id : {school} } ) " + 
				"CREATE (u)-[:HAS_SCHOOL { id : {id}, gpa : {gpa}, school : {school}, year : {year}, major : {major}, degree : {degree}, description : {description} }]->(s) ",
			params : input
		}, function(err, results) {
			if(err) {
				res.status(500);
				res.send(err);
				return;
			}

			res.send(input);

		})

	})

	app.post("/me/event/employer", session, function(req, res) {

		var input = req.body;
		input.user = req.user.id;
		input.id = uuid.v4();

		neo.cypher({
			query :
				"MATCH (u:User {id : {user} }) " +
				"MERGE (e:Employer { id : {employer} } ) " +
				"CREATE (u)-[:HAS_EMPLOYER { id : {id}, employer : {employer}, year : {year}, position : {position}, description : {description} }]->(e)",
			params : input
		}, function(err, results) {
			if(err) {
				res.status(500);
				res.send(err);
				return;
			}

			res.send(input);
		})

	})


	app.post("/me/event/test", session, function(req, res) {

		var input = req.body;
		input.user = req.user.id;
		input.id = uuid.v4();

		neo.cypher({
			query :
				"MATCH (u:User {id : {user} }) " +
				"MERGE (t:Test { id : {test} } ) " +
				"CREATE (u)-[:HAS_TEST { id : {id}, test : {test}, year : {year}, score : {score}, description : {description} }]->(t)",
			params : input
		}, function(err, results) {
			if(err) {
				res.status(500);
				res.send(err);
				return;
			}

			res.send(input);
		})

	})

	app.post("/me/event/:id/delete", session, function(req, res) {
		var id = req.params.id;

		neo.cypher({
			query : 
				"MATCH (u:User)-[r { id : {id} }]-(n) DELETE r",
			params : {
				id : id
			}
		}, function(err, results) {
			if(err) {
				res.status(500)
				res.send(err)
				return err;
			}
			return res.send()
		})
	})

}