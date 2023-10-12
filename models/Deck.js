const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
   deck_name: String,
   deck_des: String,
   admin_id: String,
   teacher_id: String,
   classroom_id: String,
});

module.exports = mongoose.model('Deck', DeckSchema);