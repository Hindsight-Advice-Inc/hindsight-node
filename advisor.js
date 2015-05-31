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
				"MATCH (u:User { id : '456'} ), " + 
				"(u)-[ti:HAS_TEST]-(t:Test), " +
				"(u)-[si:HAS_SCHOOL]-(s:SCHOOL), " +
				"(u)-[ei:HAS_EMPLOYER]-(e:Employer) " +
				"return u, collect(ti) as testInfo, collect(t) as test, collect(si) as schoolInfo, collect(s) as school, collect(ei) as employerInfo, collect(e) as employer"
		}, function(err, results) {
			if(err) {
				res.status(500);
				res.send(err);
				return;
			}

			var result = results[0]
			console.log(results)
			var payload = {};
			payload.user = {
				name : result.u.properties.name,
				story : result.u.properties.story
			}

			["test", "employer", "school"].forEach(function(field) {
				payload[field] = [];
				result[field].forEach(function(obj,i) {
					var match = result[field + "Info"][i].properties;
					match[field] = obj.properties.id;
					payload[field].push(match);
				})
			})

			res.send(payload)
		})
	})

}