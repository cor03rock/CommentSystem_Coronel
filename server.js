var mongoose = require('mongoose');

var express = require('express');

var app = express();

var commentSchema = new mongoose.Schema({
	upvotes : Number,
	author : String,
	time_elapsed : { type: Date, default: Date.now },
	message : String
});

var commentModel = mongoose.model('comments', commentSchema);

// Setup CORS related headers
var CORSSettings = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
	// deal with OPTIONS method during a preflight request
	if (req.method === 'OPTIONS') {
		res.send(200);
	} else {
		next();
	}
}

app.configure(function () {

	mongoose.connect('mongodb://localhost:27017/comments');
	mongoose.connection.once('open', function () {
		console.log('MongoDB connection opened.');
	});
	app.use(express.bodyParser());
	app.use(CORSSettings);

});

app.get('/comments', function (request, response) {
	commentModel.find({}, function (err, docs) {
		response.send(200, docs);
	});
});

app.post('/comments', function (request, response) {
	commentModel.create(request.body, function (err, docs) {
		response.send(200, docs);
	});
});

app.delete('/comments/:id', function (request, response) {
	commentModel.findByIdAndRemove(request.params.id, function (err, docs) {
		response.send(200, docs);
	});
});

app.put('/comments/:id', function (request, response) {
	var commentAttributes = {
		upvotes : parseInt(request.body.upvotes)
	}
	commentModel.findByIdAndUpdate(request.params.id,commentAttributes, function (err, docs) {
		response.send(200, docs);
	});
});
app.listen(9090);