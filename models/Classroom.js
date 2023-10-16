const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
   classroom_name: String,
   classroom_creator: String,
   classroom_des: String,
   classroom_code: String,
   teacher_id: String,
   admin_id: String,
});

module.exports = mongoose.model('Classroom', ClassroomSchema);