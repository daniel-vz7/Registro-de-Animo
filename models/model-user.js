const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  user_name: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  password: String,
  salt: String
}, { timestamps: true });

userSchema.methods.setPassword = function(password) { 
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.password = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}; 

userSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.password === hash;
}; 
  
// Exporting module to allow it to be imported in other files 
module.exports = mongoose.model('User', userSchema); 