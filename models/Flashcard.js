const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
   card_question: String,
   card_answer: String,
   deck_id: String,
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);