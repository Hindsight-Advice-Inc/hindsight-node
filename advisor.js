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
				"OPTIONAL MATCH (u)-[ti:HAS_TEST]-(t:Test) " +
				"OPTIONAL MATCH (u)-[si:HAS_SCHOOL]-(s:SCHOOL) " +
				"OPTIONAL MATCH (u)-[ei:HAS_EMPLOYER]-(e:Employer) " +
				"return u, collect(ti) as testInfo, collect(t) as test, collect(si) as schoolInfo, collect(s) as school, collect(ei) as employerInfo, collect(e) as employer"
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
					var match = result[field + "Info"][i].properties;
					match[field] = obj.properties.id;
					payload.type = field;
					payload[field].push(match);
				})
			})

			res.send(payload)
		})
	})

}