var express = require('express');
var router = express.Router();
var Promise = require('es6-promise').Promise;
var jwt = require('jsonwebtoken');
var User = require('../models/user');

const driver = require('js-bigchaindb-quickstart/dist/node');

var userFunc = require('../models/user.func');

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

router.get('/searchPerson/:name', function(req, res, next) {
    var promiseFindUser = userFunc.findOneUserName(req.params.name);

    promiseFindUser.then(
        user => {
            return searchPerson(user);
        }/*, // result: User object
        err => res.status(500).json(err) // custom error message*/
    ).then((result) => console.log("Result: ", result));

    function searchPerson(user) {
        var canDoTest = true;
        // Get all transactions for a public key 
        // Standard False: indicating if the result set should be limited to outputs that are available to spend. Defaults to “false”.
        return driver.Connection.listOutputs(
            {
                public_key: new driver.Ed25519Keypair(user.password).publicKey, 
                unspent: false
            }, 
            process.env.API_PATH_BDB)
        .then(transactionIds => {
            for (var index = 0; index < transactionIds.length; index++) {
                driver.Connection.getTransaction(transactionIds[index].substr(16, 64), process.env.API_PATH_BDB)
                    .then((res) => {
                        driver.Connection.getTransaction(res.asset.id, process.env.API_PATH_BDB)
                            .then((tx) => {
                                if(((new Date().valueOf() - new Date(tx.asset.data.testDate).valueOf()) / (1000 * 60 * 60 * 24 * 365.25)) < 5 ) {
                                    canDoTest = false;
                                }
                            });
                    });
            }

            setTimeout(function() {
                console.log("TEST DO? ", canDoTest); // Hier klopt de uitkomst // Slechte workaround
            }, 2500);            
        }).then(() => {return canDoTest});
    }
});

/*promiseFindUser.then(
        user => searchPerson(user), // result: User object
        err => res.status(500).json(err) // custom error message
    );*/

    /*promiseFindUser
        .catch((err) => res.status(500).json(err))
        .then((user) => searchPersonNew(user))
        .then((transactionIds) => {
            console.log('Retrieve list of transactions for publicKey:', new driver.Ed25519Keypair(user.password).publicKey, "\n", transactionIds);
        });*/

        
            /*console.log((new Date().valueOf() - new Date(this.myForm.value.date).valueOf()) / (1000 * 60 * 60 * 24 * 365.25));
            if(((new Date().valueOf() - new Date(this.myForm.value.date).valueOf()) / (1000 * 60 * 60 * 24 * 365.25)) < 5 ) {
                canDoTest = false;
            }
        });
    }
});
    /*promiseFindUser
        .then((user) => {
            let userObj = new driver.Ed25519Keypair(user.password).publicKey;
        
            // Get all transactions for a public key 
            // Standard False: indicating if the result set should be limited to outputs that are available to spend. Defaults to “false”.
            driver.Connection.listOutputs(
                {
                    public_key: new driver.Ed25519Keypair(user.password).publicKey, 
                    unspent: false
                }, 
                process.env.API_PATH_BDB)
        })
        .catch( err => res.status(500).json(err))
        .then(transactionIds => {
            // REMOVE
            console.log('Retrieve list of transactions for publicKey:', new driver.Ed25519Keypair(user.password).publicKey, "\n", transactionIds);
            console.log('\n\n');
        });*/


    /*promiseFindUser.then(function(user){
        searchPerson(user);
    }, function(err) {
        return res.status(500).json(err);
    });*/ // Code zonder arrow functions

   

router.post('/createTest', function (req, res, next) {
    // Find company who creates test
    var decoded = jwt.decode(req.query.token);
    var mUser = {};
    var mCompany = {};

    console.log("\nToken: " + req.query.token);

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
                createTransaction();
            }
        });
    }

    function createTransaction() {
        // Create keypair company 
        const company = new driver.Ed25519Keypair(mCompany.password);

        // Create keypair test person
        const testperson = new driver.Ed25519Keypair(mUser.password);

        ///////
        console.log("\nCompany: " + company.publicKey);
        console.log("\nPerson: " + testperson.publicKey);
        console.log("\nToken: " + req.body.name + " " + req.body.testType + " " + req.body.date + " ,remark: " + req.body.remark);
        //////
    
        var txTransferTestPersonSigned;
        // Create asset to register medical test
        const txCreateCompanySimple = driver.Transaction.makeCreateTransaction(
            {
                'testPerson': req.body.name,
                'testType': req.body.testType,
                'testDate': req.body.date
            },
            {'testRemark': req.body.remark},
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(company.publicKey))],
            company.publicKey
        ); // ASSETS // METADATA // CONDITIONS // CREATOR SIGNATURE (public)
        
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
            })*/ // Create status pollen blijft vasthangen 
            .then((res) => {
                return driver.Connection.pollStatusAndFetchTransaction(txCreateCompanySimpleSigned.id, process.env.API_PATH_BDB);
            }) // added this myself
            .then((res) => {
                // Transfer asset to test person [TRANSFER]
                const txTransferTestPerson = driver.Transaction.makeTransferTransaction(
                    txCreateCompanySimpleSigned,
                    {'metaDataMessage': 'Transfer test to test person ' + req.body.name},
                    [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(testperson.publicKey))], 0);
                
                // sign with company's private key
                txTransferTestPersonSigned = driver.Transaction.signTransaction(txTransferTestPerson, company.privateKey);
                
                // post and poll status
                return driver.Connection.postTransaction(txTransferTestPersonSigned, process.env.API_PATH_BDB)
            })
            .then((res) => {
                console.log('Response from BDB server:', res);
                console.log('REACHED END'); // HAS TO BE REMOVED
                return driver.Connection.pollStatusAndFetchTransaction(txTransferTestPersonSigned.id, process.env.API_PATH_BDB);
            });
    }
});

module.exports = router;
