var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const bip39 = require('bip39')

var User = require('../models/user');

const driver = require('bigchaindb-driver');
const conn = new driver.Connection(process.env.API_PATH_BDB)

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    })
});

// Get all tests for user
router.get('/getTests', function (req, res, next) { 
    var decoded = jwt.decode(req.query.token);
    var mUser = {};

    // Get user by userId
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
        // Get outputs for user
        getOutputs();
    });

   function getOutputs() {
        console.log("public key user: " + new driver.Ed25519Keypair(bip39.mnemonicToSeed(mUser.password).slice(0, 32)).publicKey);

        // Get outputs for user based on public key
        // listOutputs( publicKey, unspent )
        conn.listOutputs(
            new driver.Ed25519Keypair(bip39.mnemonicToSeed(mUser.password).slice(0, 32)).publicKey,
            false
        )
        // Find all transfer txs for user and further find all create txs 
        .then(ids => {
            const promiseArray = ids.map(id => {
                return conn.getTransaction(id.substr(16, 64))
                    .then(res => (conn.getTransaction(res.asset.id)));
            });

            return Promise.all(promiseArray); // Execute all promises and return array of transactions
        }).then(listOfTxs => {
            // Return list of transactions
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
