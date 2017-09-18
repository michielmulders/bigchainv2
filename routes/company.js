var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
const Promise = require('bluebird');
const bip39 = require('bip39')

const driver = require('bigchaindb-driver');
const conn = new driver.Connection(process.env.API_PATH_BDB)

var userFunc = require('../models/user.func');

// First make sure if user is authenticated
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

// OPTIONAL: LOOK AT OPERATION CREATE? GET /api/v1/transactions?asset_id={asset_id}&operation={CREATE|TRANSFER}
// Search if test person can do a test of a certain type : RETURN Boolean
router.get('/searchPersonType/:name/:type', (req, res, next) => {
    // Find user based on name
    userFunc.findOneUserName(req.params.name)
        .then(user => {
            // User public key of user to list all transactions connected to user
            return conn.listOutputs(
                new driver.Ed25519Keypair(bip39.mnemonicToSeed(user.password).slice(0, 32)).publicKey,
                false
            )
        })
        .then(txs => {
            // Get Transfer transaction for Id and further find the Create transaction for Id in res.asset
            // Next check if type is right and calculate difference in years between creation of asset and Date.now
            // Returned false if difference is lower than 5 years
            const ONE_YEAR = 1000 * 60 * 60 * 24 * 365.25;

            // Add all promises to array to be executed later synchronous
            const promiseArray = txs.map(tx => {
                return conn.getTransaction(tx.transaction_id)
                    .then(res => conn.getTransaction(res.asset.id))
                    .then(tx => {
                        if(tx.asset.data.testType == req.params.type) {
                            return ((Date.now() - new Date(tx.asset.data.testDate).valueOf()) / ONE_YEAR >= 5);
                        } else {
                            return true;
                        }
                    }) 
            });
            // OPTIONAL: Make code more performant by stopping here when you find one FALSE

            // Wait untill all promises are executed
            return Promise.all(promiseArray);
        })
        // Check if array contains FALSE -> Return true if yes (true => can't do test)
        .then(listOfBooleans => {
            var canDoTest = listOfBooleans.some(item => !item);
            return res.status(200).json({
                canDoTest: canDoTest
            });
        }).catch( error => {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        });
});

/* Function for finding all users for searchstring (autocomplete function) */
router.get('/autoCompletePerson/:name', function(req, res, next) {
    // Search like this 'name*' and flag 'i' ignores case
    User.find({'name' : new RegExp(req.params.name, 'i')}, (err, users) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        } else {
            return res.status(200).json({
                users: users
            });
        }
    });
});

router.post('/createTest', function (req, res, next) {
    console.log("create test section");

    var decoded = jwt.decode(req.query.token);
    var mUser = {};
    var mCompany = {};

    // Find company who creates test
    User.findById(decoded.user._id, function (err, company) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!company.company) {
            return res.status(500).json({
                title: 'Not a company',
                error: err
            });
        }

        mCompany = company;
        getUser();
    });

    var getUser = function() {
        // Find User to transfer asset to 
        User.findOne({'name':req.body.name}, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'User not found',
                    error: err
                });
            } else {
                mUser = user;
                // Create and Transfer transaction
                createTransaction();
            }
        });
    }

    function createTransaction() {
        // Create keypair company 
        const company = new driver.Ed25519Keypair(bip39.mnemonicToSeed(mCompany.password).slice(0, 32));
        
        // Create keypair test person
        const testperson = new driver.Ed25519Keypair(bip39.mnemonicToSeed(mUser.password).slice(0, 32));


        /*console.log("\nCompany: " + company.publicKey);
        console.log("\nPerson: " + testperson.publicKey);
        console.log("\nToken: " + req.body.name + " " + req.body.testType + " " + req.body.date + " ,remark: " + req.body.remark);*/
    
        var txTransferTestPersonSigned;

        console.log("cr1");
        // Create asset to register test
        const txCreateCompanySimple = driver.Transaction.makeCreateTransaction(
            {
                'testPerson': req.body.name,
                'testType': req.body.testType,
                'testDate': req.body.date
            },
            {'testRemark': req.body.remark},
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(company.publicKey))],
            company.publicKey
        ); // ASSETS // METADATA // [CONDITIONS] // CREATOR SIGNATURE (public)
        
        console.log("cr2");
        // Sign transaction (tx) wiht company key (private) [CREATE]
        const txCreateCompanySimpleSigned = driver.Transaction.signTransaction(txCreateCompanySimple, company.privateKey);
        
        console.log(txCreateCompanySimpleSigned);

        // send tx to bigchaindb
        conn.postTransaction(txCreateCompanySimpleSigned)
            /*.then((res) => {
                console.log('Response from BDB server', res);
                // request the status
                conn.getStatus(txCreateCompanySimpleSigned.id)
                    .then((res) => console.log('Transaction status:', res.status));
                // poll the status every 0.5 seconds
                return conn.pollStatusAndFetchTransaction(txCreateCompanySimpleSigned.id)
            })*/ // Create status fetching is stuck in loop ? 
            .then(() => {
                console.log("fetching creat");
                return conn.pollStatusAndFetchTransaction(txCreateCompanySimpleSigned.id);
            }) // added this myself to replace polling function above
            .then((res) => {
                console.log("preparing transfer");
                // Transfer asset to test person [TRANSFER]
                const txTransferTestPerson = driver.Transaction.makeTransferTransaction(
                    txCreateCompanySimpleSigned,
                    {'metaDataMessage': 'Transfer test to test person ' + req.body.name},
                    [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(testperson.publicKey))], 0);
                
                // sign with company's private key
                txTransferTestPersonSigned = driver.Transaction.signTransaction(txTransferTestPerson, company.privateKey);
                
                // post tx and poll status
                return conn.postTransaction(txTransferTestPersonSigned)
            })
            .then((res) => {
                console.log('Response from BDB server:', res);
                console.log('REACHED END');
                console.log(res);
                //return conn.pollStatusAndFetchTransaction(txTransferTestPersonSigned.id);
                return "ok";
            });
    }
});

module.exports = router;
