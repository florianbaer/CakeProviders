const express = require('express');
var request = require('request');
const axios = require('axios');
var moment = require('moment');
var fs = require('fs');
const {Nuxt, Builder} = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.get('/api', function(req, res, next) {

    request({
        uri: 'https://api-v2.swissunihockey.ch/api/games/',
        qs: {
          mode: 'team',
          team_id: 429603,
          season: 2017,
          games_per_page: 35
        }},

      function(error, response, body) {

        if (!error && response.statusCode === 200) {
          var responseBody = {
            games: []
          }

          var players = JSON.parse("{\n" +
            "  \"players\": [\n" +
            "    \"Abt Simon\",\n" +
            "    \"Bär Florian\",\n" +
            "    \"Crivelli Giona\",\n" +
            "    \"Fiechter Steven\",\n" +
            "    \"Flütsch Peter\",\n" +
            "    \"Furger Adrian\",\n" +
            "    \"Grüter Markus\",\n" +
            "    \"Hietanen Aki\",\n" +
            "    \"Koutny Jiri\",\n" +
            "    \"Laely Marco\",\n" +
            "    \"Menon Andrea\",\n" +
            "    \"Grüter Thomas\",\n" +
            "    \"Müller Matthias\",\n" +
            "    \"Schelbert Joshua\",\n" +
            "    \"Nilsson Billy\",\n" +
            "    \"Nilsson Petter\",\n" +
            "    \"Poletti Sandro\",\n" +
            "    \"Schelbert Yannick\",\n" +
            "    \"Staub Manuel\",\n" +
            "    \"Suter Tassio\",\n" +
            "    \"Thunvall Marcus\",\n" +
            "    \"Uhr Adrian\"\n" +
            "  ]\n" +
            "}\n");//fs.readFileSync('./team.json', 'utf8'));

          console.log(JSON.stringify(players));
          for (var game of JSON.parse(body).data.regions[0].rows) {

            var localGame = {
              game: null,
              Players: new Array()
            }



            if (game.cells[2].text[0] == 'Zug United' && ( game.cells[0].text[0] == 'heute' || moment(game.cells[0].text[0], 'DD.MM.YYYY') >= moment('26.09.2017', 'DD.MM.YYYY'))) {
              localGame.game = {
                date: game.cells[0].text[0],
                opponent: game.cells[3].text[0],
                location: game.cells[1].text[0]
              }

              for (var i = 0; i < 3; i++) {
                var player = players.players.pop();
                console.log(JSON.stringify(player));
                players.players.unshift(player);
                localGame.Players.push(player);
              }


              responseBody.games.push(localGame);

            }
          }



          res.json(responseBody.games);
        } else {
          res.json(error);
        }

      });
  });

// Give nuxt middleware to express
  app.use(nuxt.render)


// Listen the server
// app.listen(port, host)
  app.listen(port)
  console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}


start()
