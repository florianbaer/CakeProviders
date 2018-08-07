var mongoose = require('mongoose');

var playerSchema = new mongoose.Schema({
    name: {
      first: {type: String, required: [true, "can't be blank"]},
      last: {type: String, required: [true, "can't be blank"]}
    },
    teamId: {type: Number, required: [true, "can't be blank"]}
  },
  {
    toObject: {
      virtuals: true
    }
  });

playerSchema.virtual('fullname').get(function () {
  return this.name.first + ' ' + this.name.last;
});

module.exports = mongoose.model('Player', playerSchema);
