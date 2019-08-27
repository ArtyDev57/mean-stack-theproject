const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}
});

userSchema.plugin(validator);

module.exports = mongoose.model('User', userSchema);