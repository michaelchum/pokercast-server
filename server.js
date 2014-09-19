var express = require('express'),
	app = express(),
	port = 3000,
	poker = require('./lib/node-poker'),
	table;

app.get('/tabledefault', function(req, res){
	table = new poker.Table(50,100,2,10,100,1000);
	console.log(table);
	res.send(table);
});

app.get('/addplayer', function(req, res){
	table.AddPlayer(req.query.playername,req.query.chips)
	console.log(table.playersToAdd);
	res.send(table.playersToAdd);
});

app.get('/startgame', function(req, res){
	table.StartGame()
	console.log(table.game);
	res.send(table.game);
});

app.get('/action/', function(req, res){
	table.StartGame()
	console.log(table.game);
	res.send(table.game);
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});

