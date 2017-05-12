var User = require('./user');
var Promise = require('es6-promise').Promise;

module.exports = {
    findOneUserName: function(name) {
        return new Promise(function(resolve, reject) {
            User.findOne({'name':name}, function(err, user) {
                if (err) {
                    reject({
                        title: 'User not found',
                        error: err
                    });
                } else {
                    resolve(user);
                }
            });
        });
    }
};

// MongoDB Query Functions for User Objects