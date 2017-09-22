var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

// Save new user to database (signup)
router.post('/', function (req, res, next) {
    var user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        name: req.body.name,
        birth: req.body.birth,
        company: req.body.company
    });
    user.save(function(err, result) {
        (err) 
            ? (res.status(500).json({title: 'An error occurred', error: err})) 
            : (res.status(201).json({message: 'User created', user: result}))
    });
});

// Signin user and return token, userId and isCompany
router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) (res.status(500).json({error: err}))

        if (!user) (res.status(401).json({title: 'Login failed', error: 'Invalid login credentials'}))

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            (res.status(401).json({title: 'Login failed', error: 'Invalid password (don\'t mention in production'}))
        }

        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        return res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id,
            company: user.company
        });
    });
});

module.exports = router;
