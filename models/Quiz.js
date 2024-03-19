const { stat } = require('fs-extra');
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
   quiz_question: String,
   quiz_choice: [{
      type: mongoose.Schema.Types.String,
   }],
   quiz_answerCorrect : String,
   deck_id : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deck'
   },
   flashcard_id: String,
   stat: Number
});

module.exports = mongoose.model('Quiz', QuizSchema);