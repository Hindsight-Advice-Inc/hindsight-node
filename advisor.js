var neo = require("./neo")

module.exports = function(app) {


	app.get('/advisor/search', function (req, res){
		var params = {};
		var query = "MATCH (u:User), (u)-[s:HAS_SCHOOL]->(:School) ";

		if(req.query.school) {
			query += "MATCH (u)-[:HAS_SCHOOL]->(:School { id : {school} }) "
			params.school = req.query.school
		}
		if(req.query.degree) {
			query += "MATCH (u)-[:HAS_SCHOOL { degree : {degree} }]->(:School) "
			params.degree = req.query.degree
		}
		query += "OPTIONAL MATCH (u)-[t:HAS_TEST]->(:Test) "
		query += "return u, collect(DISTINCT s) as school, collect(DISTINCT t) as test"

		neo.cypher({
			query : query,
			params : params
		}, function(err, result) {
			if(err) {
				res.status(500);
				res.send(err);
				return;
			}

			var payload = result.map(function(row) {
				var result = row.u.properties;
				delete result.password;
				result.school = row.school.map(function(node) {
					return node.properties;
				})
				result.test = row.test.map(function(node) {
					return node.properties;
				})
				return result;
			})

			res.send(payload)

		})
	})

	app.get('/advisor/:id', function (req, res){
		var id = req.params.id;
		neo.cypher({
			query : 
				"MATCH (u:User { id : {id} } ) " + 
				"OPTIONAL MATCH (u)-[t:HAS_TEST]->(:Test) " +
				"OPTIONAL MATCH (u)-[s:HAS_SCHOOL]->(:School) " +
				"OPTIONAL MATCH (u)-[e:HAS_EMPLOYER]->(:Employer) " +
				"return u, collect(DISTINCT t) as test, collect(DISTINCT s) as school, collect(DISTINCT e) as employer",
			params : {
				id : id
			}
		}, function(err, results) {

			if(err) {
				res.status(500);
				res.send(err);
				return;
			}

			var result = results[0]
			var payload = {
				id : result.u.properties.id,
				name : result.u.properties.name,
				story : result.u.properties.story
			}

			var fields = ["test", "employer", "school"];

			fields.forEach(function(field, i) {
				payload[field] = [];
				result[field].forEach(function(obj,i) {
					var match = obj.properties;
					match.type = field;
					payload[field].push(match);
				})
			})

			res.send(payload)
		})
	})

}