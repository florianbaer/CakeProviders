const express = require('express');
const axios = require('axios');
var moment = require('moment');
const mongoose = require('mongoose');
var fs = require('fs');
const {Nuxt, Builder} = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const playerRoutes = require('./routes/player.js')
const Player = require('./models/player.js')

mongoose.Promise = require('bluebird');

function initialDatabaseSetup(setup) {
  if (setup) {
    var players = JSON.parse(fs.readFileSync('server/team.json', 'utf8'));
    for (let player of players.players) {
      new Player({
        lastname: player.split(' ')[0],
        firstname: player.split(' ')[1]
      }).save();
    }
  }
}

mongoose.connect('mongodb://localhost/cakeprovider', {
  promiseLibrary: require('bluebird')
}).then(() => {
    console.log('connection succesful')
    initialDatabaseSetup(false);
  }
).catch((err) => console.error(err));

app.set('port', port)
app.use('/player', playerRoutes);

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
        games_per_page: 35
      }
    }).then(function (response) {

      var responseBody = {
        games: []
      }

      var players = JSON.parse(fs.readFileSync('server/team.json', 'utf8'));

      //console.log(JSON.stringify(players));
      //console.log(response.data);
      //console.log(response.data.data.regions[0].rows[0].cells[2].text[0]);
      for (let game of response.data.data.regions[0].rows) {

        var localGame = {
          game: null,
          Players: new Array()
        }

        console.log('here i am')
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

    }).catch(function (err, tst) {
      console.log(err, tst);
      console.log('error happend in promise catch')
    })


    /*

    console.log(error, response, body);
      if (!error && response.statusCode === 200) {
        var responseBody = {
          games: []
        }

        var players = JSON.parse(fs.readFileSync('server/team.json', 'utf8'));

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


     */


  });

// Give nuxt middleware to express
  app.use(nuxt.render)


// Listen the server
// app.listen(port, host)
  app.listen(port)
  console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}


start()
