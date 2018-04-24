var fs = require('fs');
var axios = require('axios');
var moment = require('moment')

var spieler = fs.readFileSync('Team.txt').toString().split("\n");

axios.get('https://api-v2.swissunihockey.ch/api/games/?mode=team&team_id=429603&season=2017&games_per_page=30')
    .then(function (response) {
        var games = response;

        for (var game of response.data.data.regions[0].rows) {
            if (game.cells[2].text[0] == 'Zug United' && moment(game.cells[0].text[0], 'DD.MM.YYYY') > moment()) {


                var playerPerGame = new Array();

                for(var i = 0;i < 3; i++){
                    var player = spieler.pop();
                    spieler.unshift(player);
                    playerPerGame.push(player);
                }

                for(var player of playerPerGame){
                    console.log(game.cells[0].text[0] + ' ' + player)
                }


            }
        }
    }).catch(function (error) {
        console.log(error);
    });
