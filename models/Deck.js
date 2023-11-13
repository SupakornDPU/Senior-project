const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
   deck_name: String,
   deck_des: String,
   admin_id: String,
   teacher_id: String,
   classroom_id: String,
   flashcard: [{
      type: mongoose.Schema.Types.ObjectId, // กำหนดชนิดข้อมูลเป็น ObjectId
      ref: 'Flashcard' // อ้างอิงไปยังโมเดล Flashcard
   }]
});

module.exports = mongoose.model('Deck', DeckSchema);