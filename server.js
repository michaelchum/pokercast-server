// RESTful API for node-poker
var express = require('express'),
	app = express(),
	port = 3000,
	poker = require('./lib/node-poker'),
	table;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // NOT SAFE FOR PRODUCTION
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.get('/', function(req, res){
	
	res.send('Hello World!!!');
});

app.get('/api', function(req, res){
	
	res.send('Welcome to Node Poker RESTful API');
});
// Initialize poker table 
app.get('/api/tabledefault', function(req, res){
	table = new poker.Table(50,100,2,10,100,1000);
	//console.log(table);
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
	big_blind_player = table.game.bets.indexOf(Math.max.apply(Math, table.game.bets)); 
	console.log(big_blind_player + " " + Math.max.apply(null, table.game.bets))
	table.game.next_player = (big_blind_player + 1)  % table.game.bets.length
	index = table.game.next_player
	table.game.next_player_name = table.players[index].playerName
	res.send(table.game);
});

app.get('/api/player/:name/:move', function(req, res){
	if (req.params.move === 'call') {
		var result = find_player(table.players, req.params.name);  
		result.Call()
		index = (table.game.next_player + 1)  % table.game.bets.length
		table.game.next_player = index
		table.game.next_player_name = table.players[index].playerName
		result.next_player = table.game.next_player
		result.next_player_name = table.game.next_player_name
		res.send(result)
	}
	else if (req.params.move === 'check'){
		var result = find_player(table.players, req.params.name);  
		result.Check()
		index = (table.game.next_player + 1)  % table.game.bets.length
		table.game.next_player = index
		table.game.next_player_name = table.players[index].playerName
		result.next_player = table.game.next_player
		result.next_player_name = table.game.next_player_name
		res.send(result)
	}

	else if (req.params.move === 'fold'){
		var result = find_player(table.players, req.params.name);  
		result.Fold()
		index = (table.game.next_player + 1)  % table.game.bets.length
		table.game.next_player = index
		table.game.next_player_name = table.players[index].playerName
		result.next_player = table.game.next_player
		result.next_player_name = table.game.next_player_name
		res.send(result)
	}
});

app.get('/api/player/:name/:move/:amount', function(req, res){
	if (req.params.move === 'bet'){
		var result = find_player(table.players, req.params.name);  
		result.Bet(req.params.amount)
		index = (table.game.next_player + 1)  % table.game.bets.length
		table.game.next_player = index
		table.game.next_player_name = table.players[index].playerName
		result.next_player = table.game.next_player
		result.next_player_name = table.game.next_player_name
		res.send(result)
	}
});

app.get('/api/newround', function(req, res){
	table.initNewRound()
	res.send(table)
});

app.get('/api/winner', function(req, res){
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
