var mongoose = require('mongoose');

var playerSchema = new mongoose.Schema({
  firstname:  String,
  lastname: String
});

module.exports = mongoose.model('Player', playerSchema);
