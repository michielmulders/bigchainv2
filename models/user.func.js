var User = require('./user');
var Promise = require('es6-promise').Promise;

module.exports = {
    /* findUserById: (userId) => {
        return new Promise((resolve, reject) => {
            User.findById(userId, (err, user) => {
                if (err) {
                    reject(err)
                }
                resolve(user)
            })
        })
    }, */
    findUserById: (userId) => { 
        return User.findById(userId).exec()
    },
    findOneUserName: (name) => {
        return User.findOne({'name': name}).exec()
    }
};

// MongoDB Query Functions for User Objects
// export const findUserById = (userId) => {}