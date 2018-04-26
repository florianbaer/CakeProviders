const express = require('express');
const mongoose = require('mongoose');
const {Nuxt, Builder} = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const playerRoutes = require('./routes/api/player.js')
const Player = require('./models/player.js')


connectToDatabase = () =>{
  mongoose.connect('mongodb://localhost/cakeprovider', {
    promiseLibrary: require('bluebird')
  }).then(() => {
      console.log('connection succesful')
      initialDatabaseSetup(false);
    }
  ).catch((err) => {
      console.error(err)
    }
  );
}


initialDatabaseSetup = (setup) => {
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


mongoose.Promise = require('bluebird');


app.use(require('morgan')('dev'));

connectToDatabase();

app.use(require('./routes'));

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

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  // app.listen(port, host)
  app.listen(port)
  console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}


start()


