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

var teamVoteApprove = 0;

var teamVoteVeto = 0;

var teamVoteResponses = 0;

var missionVotePass = 0;

var missionVoteFail = 0;

var missionVoteResponses = 0;

var socketIds = [];

var playersInMissionVote = 0;

var boxColor1 = 0;

var boxColor2 = 0;

var boxColor3 = 0;

var boxColor4 = 0;

var boxColor5 = 0;

var connectAlready = 0;

io.sockets.on('connection', function (socket, username) {

    socket.emit('message', 'You are connected!');

    socket.on('usernameSend', function (username) {
        socket.username = username;

        socketIds.push(socket.id);
        console.log(socketIds);

        players.push(username);

        console.log(players);

        socket.broadcast.emit('playersUpdate', players);
        socket.emit('playersUpdate', players);

        
    });

    socket.emit('playerConfigUpdate', playersNumber);
    socket.broadcast.emit('playerConfigUpdate', playersNumber);

    socket.on('disconnect', function() {
        console.log(socket.id + " disconnected");
        var index = socketIds.indexOf(socket.id);
        console.log(index);
        socketIds.splice(index, 1);
        players.splice(index, 1);
        console.log(socketIds);
        console.log(players);
    })
    // Box Color Repeats

    socket.on('boxClick1', function () {
        boxColor1 += 1;
        if (boxColor1 === 3) {
            boxColor1 = 0;
        };

        io.emit('boxColor1Change', boxColor1);
        socket.emit('playerConfigUpdate', playersNumber);
        socket.broadcast.emit('playerConfigUpdate', playersNumber);

    });

    socket.on('boxClick3', function () {
        boxColor3 += 1;
        if (boxColor3 === 3) {
            boxColor3 = 0;
        };

        io.emit('boxColor3Change', boxColor3);

    });

    socket.on('boxClick4', function () {
        boxColor4 += 1;
        if (boxColor4 === 3) {
            boxColor4 = 0;
        };

        io.emit('boxColor4Change', boxColor4);

    });

    socket.on('boxClick5', function () {
        boxColor5 += 1;
        if (boxColor5 === 3) {
            boxColor5 = 0;
        };

        io.emit('boxColor5Change', boxColor5);

    });

    socket.on('boxClick2', function () {
        boxColor2 += 1;
        if (boxColor2 === 3) {
            boxColor2 = 0;
        };

        io.emit('boxColor2Change', boxColor2);

    });

    socket.on('teamRequest', function () {

        var chosenCard = pickedDeck.shift();

        socket.emit('teamCard', chosenCard);

    });

    socket.on('changeNumPlayers', function (data) {
        if (data == 5) {
            pickedDeck = cards5;
            console.log('Players changed to 5');
            var playersNumber = 5;
            socket.emit('playerConfigUpdate', data);
            socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 6) {
            pickedDeck = cards6;
            console.log('Players changed to 6');
            var playersNumber = 6;
            socket.emit('playerConfigUpdate', data);
            socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 7) {
            pickedDeck = cards7;
            console.log('Players changed to 7');
            var playersNumber = 7;
            socket.emit('playerConfigUpdate', data);
            socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 8) {
            pickedDeck = cards8;
            console.log('Players changed to 8');
            var playersNumber = 8;
            socket.emit('playerConfigUpdate', data);
            socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 9) {
            pickedDeck = cards9;
            console.log('Players changed to 9');
            var playersNumber = 9;
            socket.emit('playerConfigUpdate', data);
            socket.broadcast.emit('playerConfigUpdate', data);
        } else if (data == 10) {
            pickedDeck = cards10;
            console.log('Players changed to 10');
            var playersNumber = 10;
            socket.emit('playerConfigUpdate', data);
            socket.broadcast.emit('playerConfigUpdate', data);
        }
    });

    socket.on('resetBtnOnClick', function (result) {
        socket.broadcast.emit('playersUpdate', players);
        socket.emit('playersUpdate', players);
        socket.broadcast.emit('resetAll');

        players = [];

        teamVoteApprove = 0;

        teamVoteVeto = 0;

        teamVoteResponses = 0;

        missionVotePass = 0;

        missionVoteFail = 0;

        missionVoteResponses = 0;

        socketIds = [];

        playersInMissionVote = 0;

        boxColor1 = 0;

        boxColor2 = 0;

        boxColor3 = 0;

        boxColor4 = 0;

        boxColor5 = 0;
        
        console.log(result);
        if (result == 5){
            pickedDeck = cards5;
            playersNumber = 5;
            socket.emit('playerConfigUpdate', 5);
            socket.broadcast.emit('playerConfigUpdate', 5);
            socket.emit('playersNumberUpdaterNew', result);
        } else if (result == 6) {
            pickedDeck = cards6;
            playersNumber = 6;
            socket.emit('playerConfigUpdate', 6);
            socket.broadcast.emit('playerConfigUpdate', 6);
            socket.emit('playersNumberUpdaterNew', result);
            socket.broadcast.emit('playersNumberUpdaterNew', result);
        } else if (result == 7) {
            pickedDeck = cards7;
            playersNumber = 7;
            socket.emit('playerConfigUpdate', 7);
            socket.broadcast.emit('playerConfigUpdate', 7);
            socket.emit('playersNumberUpdaterNew', result);
            socket.broadcast.emit('playersNumberUpdaterNew', result);
        } else if (result == 8) {
            pickedDeck = cards8;
            playersNumber = 8;
            socket.emit('playerConfigUpdate', 8);
            socket.broadcast.emit('playerConfigUpdate', 8);
            socket.emit('playersNumberUpdaterNew', result);
            socket.broadcast.emit('playersNumberUpdaterNew', result);
        } else if (result == 9) {
            pickedDeck = cards9;
            playersNumber = 9;
            socket.emit('playerConfigUpdate', 9);
            socket.broadcast.emit('playerConfigUpdate', 9);
            socket.emit('playersNumberUpdaterNew', result);
            socket.broadcast.emit('playersNumberUpdaterNew', result);
        } else if (result == 10) {
            pickedDeck = cards10;
            playersNumber = 10;
            socket.emit('playerConfigUpdate', 10);
            socket.broadcast.emit('playerConfigUpdate', 10);
            socket.emit('playersNumberUpdaterNew', result);
            socket.broadcast.emit('playersNumberUpdaterNew', result);
        }

    });

    socket.on('resetVoteProblem', function() {
        teamVoteApprove = 0;

        teamVoteVeto = 0;

        teamVoteResponses = 0;

        socket.broadcast.emit('removeProgressBar');
        socket.emit('removeProgressBar');
    });

    socket.on('teamVoteBtnOnClick', function () {
        socket.emit('beginTeamVote');
        socket.broadcast.emit('beginTeamVote');
    });

    socket.on('playerVoteApprove', function () {
        teamVoteApprove += 1;
        teamVoteResponses += 1;
        socket.emit('playerVotedTeam', teamVoteResponses, playersNumber);
        socket.broadcast.emit('playerVotedTeam', teamVoteResponses, playersNumber);
        if (teamVoteResponses == playersNumber) {
            socket.emit('teamVoteFinished', teamVoteApprove, teamVoteVeto);
            socket.broadcast.emit('teamVoteFinished', teamVoteApprove, teamVoteVeto);
            console.log("Team vote is finished")
        }
    });

    socket.on('playerVoteVeto', function () {
        teamVoteVeto += 1;
        teamVoteResponses += 1;
        socket.emit('playerVotedTeam', teamVoteResponses, playersNumber);
        socket.broadcast.emit('playerVotedTeam', teamVoteResponses, playersNumber);
        if (teamVoteResponses == playersNumber) {
            socket.emit('teamVoteFinished', teamVoteApprove, teamVoteVeto);
            socket.broadcast.emit('teamVoteFinished', teamVoteApprove, teamVoteVeto);
            console.log("Team vote is finished")
        }
    });

    socket.on('teamVoteFinishedReset', function () {
        teamVoteApprove = 0;
        teamVoteVeto = 0;
        teamVoteResponses = 0;
    })

    socket.on('missionVoteBtnOnClickPart1', function () {
        socket.emit('missionVotePrep', players)
    });

    socket.on('missionVoteBtnOnClick', function (arrayNumber, numberPlayerInVote, playersInCurrentMissionServer) {
        playersInMissionVote = numberPlayerInVote;
        if (numberPlayerInVote === 1) {
            io.to(socketIds[arrayNumber]).emit('beginMissionVote', playersInCurrentMissionServer);
        }
        else if (numberPlayerInVote === 2) {
            io.to(socketIds[arrayNumber[0]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[1]]).emit('beginMissionVote', playersInCurrentMissionServer);
        }
        else if (numberPlayerInVote === 3) {
            io.to(socketIds[arrayNumber[0]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[1]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[2]]).emit('beginMissionVote', playersInCurrentMissionServer);
        }
        else if (numberPlayerInVote === 4) {
            io.to(socketIds[arrayNumber[0]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[1]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[2]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[3]]).emit('beginMissionVote', playersInCurrentMissionServer);
        }
        else if (numberPlayerInVote === 5) {
            io.to(socketIds[arrayNumber[0]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[1]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[2]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[3]]).emit('beginMissionVote', playersInCurrentMissionServer);
            io.to(socketIds[arrayNumber[4]]).emit('beginMissionVote', playersInCurrentMissionServer);
        }

    });

    socket.on('playerVotePass', function () {
        missionVotePass += 1;
        missionVoteResponses += 1;
        socket.emit('playerVotedMission', missionVoteResponses, playersInMissionVote);
        socket.broadcast.emit('playerVotedMission', missionVoteResponses, playersInMissionVote);
        if (missionVoteResponses == playersInMissionVote) {
            socket.emit('missionVoteFinished', missionVotePass, missionVoteFail);
            socket.broadcast.emit('missionVoteFinished', missionVotePass, missionVoteFail);
            console.log("Mission vote is finished")
        }
    });

    socket.on('playerVoteFail', function () {
        missionVoteFail += 1;
        missionVoteResponses += 1;
        socket.emit('playerVotedMission', missionVoteResponses, playersInMissionVote);
        socket.broadcast.emit('playerVotedMission', missionVoteResponses, playersInMissionVote);
        if (missionVoteResponses == playersInMissionVote) {
            socket.emit('missionVoteFinished', missionVotePass, missionVoteFail);
            socket.broadcast.emit('missionVoteFinished', missionVotePass, missionVoteFail);
            console.log("Mission vote is finished")
        }
    });

    socket.on('missionVoteFinishedReset', function () {
        missionVotePass = 0;
        missionVoteFail = 0;
        missionVoteResponses = 0;
        playersInMissionVote = 0;
    })
});