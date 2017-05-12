var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema is helper object to create blueprint of models
var mongooseUniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    email: {type:String, required: true, unique: true, lowercase: true, trim: true},
    password: {type:String, required: true},
    name: {type:String, required: true, lowercase: true, trim: true},
    birth: String,
    company: Boolean
});

userSchema.plugin(mongooseUniqueValidator);
// Install: npm install --save mongoose-unique-validator
// To assure that every email is unique

var User = mongoose.model('User', userSchema);
module.exports = User;
// Mongo Schema for User object