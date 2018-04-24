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

  app.get('/api', function (req, res, next) {
    axios.get('https://api-v2.swissunihockey.ch/api/games/', {
      params: {
        mode: 'team',
        team_id: 429603,
        season: 2017,
        games_per_page: 30
      }
    }).then(ans => {
      console.log(ans)
      if (!error && ans.statusCode === 200) {
        var responseBody = {
          games: []
        }

        var players;
        try {
          var fileread = fs.readFileSync('./team.json', 'utf-8');
          console.log('read successful');
          players = JSON.parse(fileread);
        }
        catch (err) {
          console.log('read not successful')
          if (err.code === 'ENOENT') {
            console.log('File not found!');
          } else {
            throw err;
          }
        }
        console.log(' output of file is coming')
        console.log(JSON.stringify(players));
        for (var game of JSON.parse(body).data.regions[0].rows) {

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
              console.log(JSON.stringify(player));
              players.players.unshift(player);
              localGame.Players.push(player);
            }


            responseBody.games.push(localGame);

          }
        }


        res.json(responseBody.games);
      }
      else {
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
