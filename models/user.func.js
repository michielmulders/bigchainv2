var User = require('./user');

module.exports = {
    findUserById: (userId) => (User.findById(userId).exec()),
    findOneUserName: (name) => (User.findOne({'name': name}).exec()),
    findUsersByName: (name) => (User.find({'name': name}).exec())
};

// MongoDB Query Functions for User Objects
// export const findUserById = (userId) => {}