const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
   card_question: String,
   card_answer: String,
   deck_id: String,
   quiz_id: [{
      type: mongoose.Schema.Types.ObjectId, // กำหนดชนิดข้อมูลเป็น ObjectId
      ref: 'Quiz' // อ้างอิงไปยังโมเดล Quiz
   }]
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);