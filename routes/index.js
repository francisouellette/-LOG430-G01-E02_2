var express = require('express');
const moment = require('moment');
const DBUtils = require('../config/DBUtils');
const Aggregateur = require('../script/Aggregateur');

var router = express.Router();

router.get('/test', function(req, res, next) {
    res.send("TEST")
})

router.get('/topics', function(req, res) {
    DBUtils.getTopics(req.app.get('conn')).then(function(topics){
        res.send(topics)
    })
})
router.post('/createAgregateur', function(req, res, next) {
    let params = req.body
    console.log(params)
    Aggregateur.CreateAggregate(req.app.get('conn'), params.fin, params.topic, parseInt(params.intervalle) * 1000, params.agregat)
})

module.exports = router;
