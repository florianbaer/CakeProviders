var express = require('express');
const axios = require('axios');
var moment = require('moment');
var router = express.Router();
var Player = require('../../models/player.js');


router.get('/:teamId', function (req, res, next) {

  axios.get('https://api-v2.swissunihockey.ch/api/games/', {
    params: {
      mode: 'team',
      team_id: req.params.teamId,
      season: 2019,
      games_per_page: 35
    }
  }).then(function (response) {

    var responseBody = {
      games: []
    }
    var mysort = {first: 1};
    Player.find({teamId: req.params.teamId}).sort(mysort).then((players) => {
      console.log(players)
      for (let game of response.data.data.regions[0].rows) {

        var localGame = {
          game: null,
          Players: new Array()
        }

        if (game.cells[2].text[0] == 'Zug United'/* && (game.cells[0].text[0] == 'heute' || moment(game.cells[0].text[0], 'DD.MM.YYYY') >= moment('26.09.2017', 'DD.MM.YYYY'))*/) {
          localGame.game = {
            date: game.cells[0].text[0],
            opponent: game.cells[3].text[0],
            location: game.cells[1].text[0]
          }
          for (var i = 1; i < 3; i++) {
            var player = players.pop();
            players.unshift(player);
            console.log(player)
            localGame.Players.push(player.fullname);
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
