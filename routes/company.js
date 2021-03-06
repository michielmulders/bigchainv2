var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
const Promise = require('bluebird');
const bip39 = require('bip39')

const driver = require('bigchaindb-driver');
const conn = new driver.Connection(process.env.API_PATH_BDB)

var userFunc = require('../models/user.func');
var gCompany, gTestperson;

// First make sure if user is authenticated
router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', (err, decoded) => {
        (err) ? (res.status(401).json({title: 'Not authenticated', error: err})) : next();
    })
});

// OPTIONAL: LOOK AT OPERATION CREATE? GET /api/v1/transactions?asset_id={asset_id}&operation={CREATE|TRANSFER}
// Search if test person can do a test of a certain type : RETURN Boolean
const searchPersonByType = (req, res, next) => {
    // Find user based on name
    userFunc.findOneUserName(req.params.name)
        .then(getListOutputsForUser)
        .then(txs => (checkListOutputsForUser(txs, req.params.type)))
        .then(listOfBooleans => (res.status(200).json({canDoTest: listOfBooleans.some(item => !item)})))
        .catch(error => (res.status(500).json({title: 'An error occurred', error: error})))
}

// User public key of user to list all transactions connected to user
const getListOutputsForUser = (user) => (conn.listOutputs(new driver.Ed25519Keypair(bip39.mnemonicToSeed(user.password).slice(0, 32)).publicKey))

const checkListOutputsForUser = (txs, type) => {
    // Get Transfer transaction for Id and further find the Create transaction for Id in res.asset
    // Next check if type is right and calculate difference in years between creation of asset and Date.now
    // Returned false if difference is lower than 5 years
    const ONE_YEAR = 1000 * 60 * 60 * 24 * 365.25;

    // Add all promises to array to be executed later synchronous
    var promiseArray = txs.map(tx => {
        return conn.getTransaction(tx.transaction_id)
            .then(res => (conn.getTransaction(res.asset.id)))
            .then(tx => {
                if(tx.asset.data.testType == type) {
                    return ((Date.now() - new Date(tx.asset.data.testDate).valueOf()) / ONE_YEAR >= 5)
                }
                return true
            }) 
    }) 
    // OPTIONAL: Make code more performant by stopping here when you find one FALSE
    // However, this requires the use of 'break' which I tend not to use in my code.
    // Plus: ES6 .map method doesn't have a way to break the loop

    // Wait untill all promises are executed
    return Promise.all(promiseArray)
}

router.get('/searchPersonType/:name/:type', searchPersonByType)

// Function for finding all users for searchstring (autocomplete function)
router.get('/autoCompletePerson/:name', function(req, res, next) {
    // @regex: flag 'i' ignores case
    userFunc.findUsersByName(new RegExp(req.params.name, 'i'))
        .then(users => (res.status(200).json({users: users})))
        .catch(error => (res.status(500).json({error: error})))
});

const searchUserById = (req, res, next) => {
    userFunc.findUserById(jwt.decode(req.query.token).user._id)
        .then(company => {
            return userFunc.findOneUserName(req.body.name)
                .then(user => {
                    gCompany = new driver.Ed25519Keypair(bip39.mnemonicToSeed(company.password).slice(0, 32));
                    gTestperson = new driver.Ed25519Keypair(bip39.mnemonicToSeed(user.password).slice(0, 32));

                    return {'name': req.body.name, 'type': req.body.testType, 'date': req.body.date, 'remark': req.body.remark}
                })
        })
        .then(createTransaction)
        .then(signTransaction)
        .then(sendToBlockchain)
        .then(fetchStatusTx)
        .then(prepareTransferTx)
        .then(signTransaction)
        .then(sendToBlockchain)
        .then(fetchStatusTx)
        .then(tx => (res.status(200).json({'transferTx': tx})))
        .catch(error => (res.status(500).json({'title': 'An error occurred', 'error': error})))
}

const createTransaction = (data) => {
    return driver.Transaction.makeCreateTransaction(
        {
            'testPerson': data.name,
            'testType': data.type,
            'testDate': data.date
        },
        {'testRemark': data.remark},
        [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(gCompany.publicKey))],
        gCompany.publicKey
    )
}

const signTransaction = (tx) => (driver.Transaction.signTransaction(tx, gCompany.privateKey))

const sendToBlockchain = (tx) => (conn.postTransaction(tx))

const fetchStatusTx = (tx) => (conn.pollStatusAndFetchTransaction(tx.id))

const prepareTransferTx = (txSigned) => {
    return driver.Transaction.makeTransferTransaction(
        txSigned,
        {'metaDataMessage': 'Transfer test'},
        [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(gTestperson.publicKey))], 0)
}

router.post('/createTest', searchUserById)

module.exports = router;