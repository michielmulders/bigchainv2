var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const Promise = require('bluebird')
const bip39 = require('bip39')
var userFunc = require('../models/user.func')
// import * as userFunc from '../models/user.func'

var User = require('../models/user')

const driver = require('bigchaindb-driver')
const conn = new driver.Connection(process.env.API_PATH_BDB)

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', (err, decoded) => {
        (err) ? (res.status(401).json({title: 'Not authenticated', error: err})) : next();
    })
});

const searchUserById = (req, res, next) => {
    userFunc.findUserById(jwt.decode(req.query.token).user._id)
        .then(getListOutputsForUser)
        .then(getAssetsForUser)
        .then(listOfTxs => (res.status(200).json({transactions: listOfTxs})))
        .catch(error => (res.status(500).json({'title': 'An error occurred', 'error': error})))
}

// User public key of user to list all transactions connected to user
const getListOutputsForUser = (user) => (conn.listOutputs(new driver.Ed25519Keypair(bip39.mnemonicToSeed(user.password).slice(0, 32)).publicKey))

// Find all transfer txs for user and further find all create txs 
const getAssetsForUser = (txs) => {
    const promiseArray = txs.map(tx => {
        return conn.getTransaction(tx.transaction_id)
            .then(res => (conn.getTransaction(res.asset.id)));
    });

    return Promise.all(promiseArray); // Execute all promises and return array of transactions
}

// Get all tests for user
router.get('/getTests', searchUserById)

module.exports = router;
