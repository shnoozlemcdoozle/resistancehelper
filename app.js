var express = require('express'),
    server = express();

var cards5 = ['a spy!', ' a spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards6 = ['a spy!', ' a spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards7 = ['a spy!', ' a spy!', 'a spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards8 = ['a spy!', ' a spy!', 'a spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards9 = ['a spy!', ' a spy!', 'a spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards10 = ['a spy!', 'a spy!', ' a spy!', 'a spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!']



pickedDeck = cards5;

function shuffleDeck(deck) {
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return deck;
  }

  shuffleDeck(pickedDeck);
// Loading the file index.html displayed to the client

var port = process.env.PORT || 8080;

server.use(express.static(__dirname + '/public'));

// Loading socket.io
var io = require('socket.io').listen(server.listen(port));

var players = [];

var playersNumber = 5;

io.sockets.on('connection', function (socket, username) {
    // When the client connects, they are sent a message
    socket.emit('message', 'You are connected!');
    
    // As soon as the username is received, it's stored as a session variable
    socket.on('usernameSend', function(username) {
        socket.username = username;
        
        players.push(username);
        
        console.log(players);
        
        socket.broadcast.emit('playersUpdate', players);
        socket.emit('playersUpdate', players);

        socket.emit('playersNumberUpdaterNew', playersNumber);
        });
    
    socket.on('teamRequest', function() {

      var chosenCard = pickedDeck.shift();

      socket.emit('teamCard', chosenCard);

    });

    socket.on('changeNumPlayers', function(data) {
        if (data == 5) {
            pickedDeck = cards5;
            console.log('Players changed to 5');
            playersNumber = 5;
            socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 6) {
            pickedDeck = cards6;
            console.log('Players changed to 6');
            playersNumber = 6;
            socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 7) {
            pickedDeck = cards7;
            console.log('Players changed to 7');
            playersNumber = 7;
           socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 8) {
            pickedDeck = cards8;
            console.log('Players changed to 8');
            playersNumber = 8;
           socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 9) {
            pickedDeck = cards9;
            console.log('Players changed to 9');
            playersNumber = 9;
            socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 10) {
            pickedDeck = cards10;
            console.log('Players changed to 10');
            playersNumber = 10;
            socket.broadcast.emit('playerConfigUpdate', data);
        }
    });

    socket.on('resetBtnOnClick', function() {
        players = [];
        pickedDeck = cards5;
        socket.broadcast.emit('playersUpdate', players);
        socket.emit('playersUpdate', players);
        socket.broadcast.emit('resetAll')
    });
    
});