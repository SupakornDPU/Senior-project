const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
   classroom_name: String,
   classroom_creator: String,
   classroom_des: String,
   classroom_code: String,
   teacher_id: String,
   admin_id: String,
   deck: [{
      type: mongoose.Schema.Types.ObjectId, // กำหนดชนิดข้อมูลเป็น ObjectId
      ref: 'Deck' // อ้างอิงไปยังโมเดล Deck
   }]
});

module.exports = mongoose.model('Classroom', ClassroomSchema);