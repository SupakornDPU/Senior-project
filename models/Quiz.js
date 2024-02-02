const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
   question: String,
   choice: [{
      type: mongoose.Schema.Types.String, 
   }],
   answerCorrect : String,
   deck_id : String,
});

module.exports = mongoose.model('Quiz', QuizSchema);