var http = require('http');
var fs = require('fs');

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
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Loading socket.io
var io = require('socket.io').listen(server);

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


server.listen(process.env.PORT || 8080);