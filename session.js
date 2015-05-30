var neo = require("./neo.js")

module.exports = function(req,res,next) {

	var session = req.query.session;

	neo.cypher({
		query : 
			"MATCH (u:User)<-[:LOGIN]-(s:Session { id : {session} }) return u",
		params : {
			session : session
		}
	}, function(err, results) {

		if(err || results.length == 0) {
			res.status(500);
			res.send(err)
		}

		req.user = results[0].u.properties;

		next()


	})


}