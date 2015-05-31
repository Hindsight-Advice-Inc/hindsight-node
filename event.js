var uuid = require("uuid")
var neo = require("./neo.js")
var session = require("./session")

module.exports = function(app) {

	app.post("/me/event/school", session, function(req, res) {
		
		var input = req.body;
		input.user = req.user.id;

		neo.cypher({
			query : 
				"MATCH (u:User {id : {user} }) " +
				"MERGE (s:School {id : {school} } ) " + 
				"CREATE (u)-[:HAS_SCHOOL { school : {school}, year : {year}, major : {major}, degree : {degree} }]->(s) ",
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

		neo.cypher({
			query :
				"MATCH (u:User {id : {user} }) " +
				"MERGE (e:Employer { id : {employer} } ) " +
				"CREATE (u)-[:HAS_EMPLOYER { employer : {employer}, year : {year}, position : {position} }]->(e)",
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

		neo.cypher({
			query :
				"MATCH (u:User {id : {user} }) " +
				"MERGE (t:Test { id : {test} } ) " +
				"CREATE (u)-[:HAS_TEST { test : {test}, year : {year}, score : {score} }]->(t)",
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

}