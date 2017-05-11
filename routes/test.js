var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Promise = require('bluebird');

var User = require('../models/user');

const driver = require('js-bigchaindb-quickstart/dist/node');

/*router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    })
});*/

router.get('/getTests', function (req, res, next) { 
    var decoded = jwt.decode(req.query.token);
    var mUser = {};

    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        /*if (user.company) {
            return res.status(500).json({
                title: 'Not a test person',
                error: err
            });
        }*/

        mUser = user;
        getOutputs();
    });

   function getOutputs() {
        driver.Connection.listOutputs(
        {
            public_key: new driver.Ed25519Keypair(mUser.password).publicKey,
            unspent: false
        },
        process.env.API_PATH_BDB)
        .then(ids => {
            const promiseArray = ids.map(id => {
                return driver.Connection.getTransaction(id.substr(16, 64), process.env.API_PATH_BDB)
                    .then(res => (driver.Connection.getTransaction(res.asset.id, process.env.API_PATH_BDB)));
            });

            return Promise.all(promiseArray); // Return array of transactions
        }).then(listOfTxs => {
            return res.status(200).json({
                transactions: listOfTxs
            });
        }).catch( error => {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        });
   }
});

module.exports = router;
