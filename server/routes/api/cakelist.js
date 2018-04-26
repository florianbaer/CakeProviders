var express = require('express');
const axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var router = express.Router();
var Player = require('../../models/player.js');


router.get('/', function (req, res, next) {

  axios.get('https://api-v2.swissunihockey.ch/api/games/', {
    params: {
      mode: 'team',
      team_id: 429603,
      season: 2017,
      games_per_page: 35
    }
  }).then(function (response) {

    var responseBody = {
      games: []
    }

    Player.find().then((players) => {


      var players = JSON.parse(fs.readFileSync('server/team.json', 'utf8'));

      for (let game of response.data.data.regions[0].rows) {

        var localGame = {
          game: null,
          Players: new Array()
        }

        if (game.cells[2].text[0] == 'Zug United' && (game.cells[0].text[0] == 'heute' || moment(game.cells[0].text[0], 'DD.MM.YYYY') >= moment('26.09.2017', 'DD.MM.YYYY'))) {
          localGame.game = {
            date: game.cells[0].text[0],
            opponent: game.cells[3].text[0],
            location: game.cells[1].text[0]
          }

          for (var i = 0; i < 3; i++) {
            var player = players.players.pop();
            players.players.unshift(player);
            localGame.Players.push(player);
          }


          responseBody.games.push(localGame);

        }
      }


      res.json(responseBody.games);

    }).catch((err) => {
      return next(err);
    });
  }).catch(function (err, tst) {
    console.log(err, tst);
  })
});



module.exports = router;
