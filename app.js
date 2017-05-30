var express = require('express'),
    server = express();

var cards = ['You are a spy!', 'You are a spy!', 'You are part of the resistance!', 'You are part of the resistance!', 'You are part of the resistance!'];

function shuffleDeck(deck) {
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return deck;
  }

  shuffleDeck(cards);
// Loading the file index.html displayed to the client

var port = process.env.PORT;

server.use(express.static(__dirname + '/public'));

// Loading socket.io
var io = require('socket.io').listen(server.listen(port));

var players = [];

io.sockets.on('connection', function (socket, username) {
    // When the client connects, they are sent a message
    socket.emit('message', 'You are connected!');
    
    // As soon as the username is received, it's stored as a session variable
    socket.on('little_newbie', function(username) {
        socket.username = username;
        
        players.push(username);
        
        console.log(players);
        
        socket.broadcast.emit('playersUpdate', players);
        socket.emit('playersUpdate', players);
        });
    
    socket.on('teamRequest', function() {

      var chosenCard = cards.shift();

      socket.emit('teamCard', chosenCard);

    });
    
});