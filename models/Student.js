const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Classroom = require('./Classroom');

const StudentSchema = new mongoose.Schema({
   user_email: String,
   user_firstname: String,
   user_lastname: String,
   user_password: String,
   user_role: String,
   user_phone: String,
   classroom: [{
      type: mongoose.Schema.Types.ObjectId, // กำหนดชนิดข้อมูลเป็น ObjectId
      ref: 'Classroom' // อ้างอิงไปยังโมเดล Classroom
   }]
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