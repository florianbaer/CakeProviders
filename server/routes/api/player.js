var express = require('express');
var router = express.Router();
var Player = require('../../models/player.js');

router.get('/:teamId', function (req, res, next) {
  Player.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

router.get('/:teamId', function (req, res, next) {
  Player.find({teamId: req.param.teamId}, function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});


router.post('/', function (req, res, next) {
  Player.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', function (req, res, next) {
  console.log(req.body);
  Player.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', function (req, res, next) {
  Player.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
