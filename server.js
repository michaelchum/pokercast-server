// RESTful API for node-poker
var express = require('express'),
	app = express(),
	port = 3000,
	poker = require('./lib/node-poker'),
	table;

app.get('/', function(req, res){
	
	res.send('Hello World!!!');
});

app.get('/api', function(req, res){
	
	res.send('Welcome to Node Poker RESTful API');
});

app.get('/api/tabledefault', function(req, res){
	table = new poker.Table(50,100,2,10,100,1000);
	console.log(table);
	res.send(table);
});

app.get('/api/addplayer/:name/:chips', function(req, res){
	
	table.AddPlayer(req.params.name,req.params.chips)
	console.log(req.params);
	res.send(req.params);
});

app.get('/api/players', function(req, res){
  res.send(table.players)
});

app.get('/api/player/:name', function(req, res){
  var result = find_player(table.players, req.params.name);  
  console.log('result: ' + result)
  res.send(result)
});

app.get('/api/startgame', function(req, res){
	table.StartGame()
	console.log(table.game);
	res.send(table.game);
});

app.get('/api/player/:name/:move', function(req, res){
	if (req.params.move === 'call') {
		var result = find_player(table.players, req.params.name);  
		result.Call()
		res.send(result)
		//res.send(req.params.name  + 'did a move: ' + req.params.move)
	}
	else if (req.params.move === 'check'){
		var result = find_player(table.players, req.params.name);  
		result.Check()
		res.send(result)
	}

	else if (req.params.move === 'fold'){
		var result = find_player(table.players, req.params.name);  
		result.Fold()
		res.send(result)
	}
});

app.get('/api/player/:name/:move/:amount', function(req, res){
	if (req.params.move === 'bet'){
		var result = find_player(table.players, req.params.name);  
		result.Bet(req.params.amount)
		res.send(result)
	}
});

app.get('/api/newround', function(req, res){
	table.initNewRound()
	res.send(table)
});

// app.get('/api/evaluatehands/:players', function(req, res){
// 	//rankHands
// 	players = req.params.players
// 	hands = []
// 	for (player in players) {
// 		hands.push(player.hand)
// 	}
// 	best_hand = poker.rankHands(hands)
	
// 	res.send(table)
// });

app.get('/api/winner', function(req, res){
	//rankHands
	// players = req.params.players
	// hands = []
	// for (player in players) {
	// 	hands.push(player.hand)
	// }
	// best_hand = poker.rankHands(hands)
	winner = table.getWinners()
	res.send(winner)
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});

// helper function to find player index in list of players

function find_player(list_of_players, name) {
	for (var i = 0; i < list_of_players.length; i++) {
  		if (list_of_players[i].playerName === name) {
  			return list_of_players[i]  		
  		}
  	}
  	return null
}
