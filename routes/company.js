var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
const Promise = require('bluebird');

const driver = require('js-bigchaindb-quickstart/dist/node');

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
            return driver.Connection.listOutputs(
                {
                    public_key: new driver.Ed25519Keypair(user.password).publicKey,
                    unspent: false
                },
                process.env.API_PATH_BDB)
        })
        .then(ids => {
            // Get Transfer transaction for Id and further find the Create transaction for Id in res.asset
            // Next check if type is right and calculate difference in years between creation of asset and Date.now
            // Returned false if difference is lower than 5 years
            const ONE_YEAR = 1000 * 60 * 60 * 24 * 365.25;

            // Add all promises to array to be executed later synchronous
            const promiseArray = ids.map(id => {
                console.log(id);
                return driver.Connection.getTransaction(id.substr(16, 64), process.env.API_PATH_BDB)
                    .then(res => driver.Connection.getTransaction(res.asset.id, process.env.API_PATH_BDB))
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
        const company = new driver.Ed25519Keypair(mCompany.password);

        // Create keypair test person
        const testperson = new driver.Ed25519Keypair(mUser.password);

        /*console.log("\nCompany: " + company.publicKey);
        console.log("\nPerson: " + testperson.publicKey);
        console.log("\nToken: " + req.body.name + " " + req.body.testType + " " + req.body.date + " ,remark: " + req.body.remark);*/
    
        var txTransferTestPersonSigned;

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
        
        // Sign transaction (tx) wiht company key (private) [CREATE]
        const txCreateCompanySimpleSigned = driver.Transaction.signTransaction(txCreateCompanySimple, company.privateKey);
        
        console.log(txCreateCompanySimpleSigned);

        // send tx to bigchaindb
        driver.Connection.postTransaction(txCreateCompanySimpleSigned, process.env.API_PATH_BDB)
            /*.then((res) => {
                console.log('Response from BDB server', res);
                // request the status
                driver.Connection
                    .getStatus(txCreateCompanySimpleSigned.id, API_PATH)
                    .then((res) => console.log('Transaction status:', res.status));
                // poll the status every 0.5 seconds
                return driver.Connection.pollStatusAndFetchTransaction(txCreateCompanySimpleSigned.id, process.env.API_PATH_BDB)
            })*/ // Create status fetching is stuck in loop ? 
            .then((res) => {
                return driver.Connection.pollStatusAndFetchTransaction(txCreateCompanySimpleSigned.id, process.env.API_PATH_BDB);
            }) // added this myself to replace polling function above
            .then((res) => {
                // Transfer asset to test person [TRANSFER]
                const txTransferTestPerson = driver.Transaction.makeTransferTransaction(
                    txCreateCompanySimpleSigned,
                    {'metaDataMessage': 'Transfer test to test person ' + req.body.name},
                    [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(testperson.publicKey))], 0);
                
                // sign with company's private key
                txTransferTestPersonSigned = driver.Transaction.signTransaction(txTransferTestPerson, company.privateKey);
                
                // post tx and poll status
                return driver.Connection.postTransaction(txTransferTestPersonSigned, process.env.API_PATH_BDB)
            })
            .then((res) => {
                console.log('Response from BDB server:', res);
                console.log('REACHED END');
                return driver.Connection.pollStatusAndFetchTransaction(txTransferTestPersonSigned.id, process.env.API_PATH_BDB);
            });
    }
});

module.exports = router;
