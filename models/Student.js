const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const StudentSchema = new mongoose.Schema({
   user_email: String,
   user_firstname: String,
   user_lastname: String,
   user_password: String,
   user_role: String,
   user_phone: String,
})

StudentSchema.pre('save', function (next) {
   const user = this;
   bcrypt.hash(user.user_password, 10).then(hash => {
      user.user_password = hash;
      next();
   }).catch(err => {
      console.error(err);
   });
})

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;