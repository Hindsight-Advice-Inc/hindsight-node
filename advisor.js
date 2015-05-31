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
		var id = req.param('id');
	})

}