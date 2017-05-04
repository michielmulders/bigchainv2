var express = require('express');
var router = express.Router();
const driver = require('js-bigchaindb-quickstart/dist/node');

router.get('/', function (req, res, next) {
    res.render('index');
});

module.exports = router;
