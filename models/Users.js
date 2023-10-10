const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
   user_email: String,
   user_firstname: String,
   user_lastname: String,
   user_password: String,
   user_role: String,
   user_phone: String,
})

UserSchema.pre('save', function (next) {
   const user = this;
   bcrypt.hash(user.user_password, 10).then(hash => {
      user.user_password = hash;
      next();
   }).catch(err => {
      console.error(err);
   });
})

const User = mongoose.model('User', UserSchema);
module.exports = User;

