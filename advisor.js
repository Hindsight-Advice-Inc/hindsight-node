var neo = require("./neo")

module.exports = function(app) {


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
		var id = req.query.id;
		neo.cypher({
			query : 
				"MATCH (u:User { id : '456'} ) " + 
				"OPTIONAL MATCH (u)-[t:HAS_TEST]->(:Test) " +
				"OPTIONAL MATCH (u)-[s:HAS_SCHOOL]->(:School) " +
				"OPTIONAL MATCH (u)-[e:HAS_EMPLOYER]->(:Employer) " +
				"return u, collect(DISTINCT t) as test, collect(DISTINCT s) as school, collect(DISTINCT e) as employer"
		}, function(err, results) {

			if(err) {
				res.status(500);
				res.send(err);
				return;
			}

			var result = results[0]
			var payload = {};
			payload.user = {
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