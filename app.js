var express = require('express'),
    server = express();

var cards5 = ['spy!', 'spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards6 = ['spy!', 'spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards7 = ['spy!', 'spy!', 'spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards8 = ['spy!', 'spy!', 'spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards9 = ['spy!', 'spy!', 'spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'],
    cards10 = ['spy!', 'spy!', 'spy!', 'spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!']



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

var teamVoteApprove = 0;

var teamVoteVeto = 0;

var teamVoteResponses = 0;

var missionVotePass = 0;

var missionVoteFail = 0;

var missionVoteResponses = 0;


io.sockets.on('connection', function (socket, username) {
    
    socket.emit('message', 'You are connected!');
    
    
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
        pickedDeck = ['spy!', 'spy!', 'part of the resistance!', 'part of the resistance!', 'part of the resistance!'];
        socket.broadcast.emit('playersUpdate', players);
        socket.emit('playersUpdate', players);
        socket.broadcast.emit('resetAll')
        playersNumber = 5;
        socket.broadcast.emit('playerConfigUpdate', 5);
    });

    socket.on('teamVoteBtnOnClick', function() {
        socket.emit('beginTeamVote');
        socket.broadcast.emit('beginTeamVote');
    });

    socket.on('playerVoteApprove', function() {
        teamVoteApprove += 1;
        teamVoteResponses += 1;
        if (teamVoteResponses == playersNumber) {
            socket.emit('teamVoteFinished', teamVoteApprove, teamVoteVeto);
            socket.broadcast.emit('teamVoteFinished', teamVoteApprove, teamVoteVeto);
            console.log("Team vote is finished")
        }
    });
    
    socket.on('playerVoteVeto', function() {
        teamVoteVeto += 1;
        teamVoteResponses += 1;
        if (teamVoteResponses == playersNumber) {
            socket.emit('teamVoteFinished', teamVoteApprove, teamVoteVeto);
            socket.broadcast.emit('teamVoteFinished', teamVoteApprove, teamVoteVeto);
            console.log("Team vote is finished")
        }
    });

    socket.on('teamVoteFinishedReset', function() {
        teamVoteApprove = 0;
        teamVoteVeto = 0;
        teamVoteResponses = 0;
    })
    
    socket.on('missionVoteBtnOnClick', function() {
        socket.emit('beginMissionVote');
        socket.broadcast.emit('beginMissionVote');
    });

    socket.on('playerVotePass', function() {
        missionVotePass += 1;
        missionVoteResponses += 1;
        if (missionVoteResponses == playersNumber) {
            socket.emit('missionVoteFinished', missionVotePass, missionVoteFail);
            socket.broadcast.emit('missionVoteFinished', missionVotePass, missionVoteFail);
            console.log("Mission vote is finished")
        }
    });
    
    socket.on('playerVoteFail', function() {
        missionVoteFail += 1;
        missionVoteResponses += 1;
        if (missionVoteResponses == playersNumber) {
            socket.emit('missionVoteFinished', missionVotePass, missionVoteFail);
            socket.broadcast.emit('missionVoteFinished', missionVotePass, missionVoteFail);
            console.log("Mission vote is finished")
        }
    });

    socket.on('missionVoteFinishedReset', function() {
        missionVotePass = 0;
        missionVoteFail = 0;
        missionVoteResponses = 0;
    })
});