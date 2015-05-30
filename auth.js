var neo = require("./neo.js")
var uuid = require("uuid")
module.exports = function(app) {

	app.post('/auth/login', function (req, res){

		var input = req.body;
		neo.cypher({
	    	query: 'MATCH (u:User { email :{email}, password : {password} }) RETURN u;',
	    	params: {
	        	email: input.email,
	        	password: input.password,
	    	},
		}, function (err, results) {
			if(results.length == 0) {
				res.status(500)
				res.send("")
				return
			}

			var user = results[0].u.id;
			console.log(JSON.stringify(results))
			var session = uuid.v4()

			neo.cypher({
				query : 
					"MATCH (u:User { id : {user} }) " +
					"CREATE (s:Session { id : {session} }) " +
					"CREATE (s)-[:LOGIN]->(u)",
				params : {
					user : user,
					session : session
				}
			}, function(err, results) {
				if(err) {
					res.status(500)
					res.send(err)
				}
				res.send(session)
			})



		});


	})

	app.post('/auth/logout', function (req, res) {
		var session = req.query.session
		neo.cypher({
		query: 'MATCH (s:Session { id: {session} })-[l:LOGIN]->(:User) DELETE l,s'
		params : {
			session: session
		}
	}, function(err, results) {
		res.send();
	})
}
