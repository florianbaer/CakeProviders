var mongoose = require('mongoose');

var playerSchema = new mongoose.Schema({
  firstname: {type: String, required: [true, "can't be blank"]},
  lastname: {type: String, required: [true, "can't be blank"]}
});

module.exports = mongoose.model('Player', playerSchema);
