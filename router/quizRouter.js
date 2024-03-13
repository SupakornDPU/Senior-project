const express = require('express');
const quizRouter = express.Router();
const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');
const Deck = require('../models/Deck');
const Flashcard = require('../models/Flashcard');

quizRouter.get('/', (req, res, next) => {
    Quiz.find()
        .then((Quiz) => {
            res.json(Quiz);
        })
        .catch((err) => {
            next(err);
        });
});

quizRouter.get('/getById/:id', (req, res, next) => {
  Quiz.findById(req.params.id)
    .then((Quiz) => {
      res.json(Quiz);
    })
    .catch((err) => {
      next(err);
    });
});

// Post Router สำหรับสร้าง Deck
quizRouter.post('/', (req, res, next) => {
    Quiz.create(req.body)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((err) => {
            next(err);
        }); 
});

// quizRouter.post('/:deckId', async (req, res) => {
//     try {
//       const deckId = req.params.deckId;
//       const quizData = req.body.data;
  
//       const newQuiz = new Quiz({
//         quiz_question: quizData.quiz_question,
//         quiz_choice: quizData.quiz_choice,
//         quiz_answerCorrect: quizData.quiz_answerCorrect,
//         deck_id: deckId,
//       });
  
//       // บันทึกลงฐานข้อมูล
//       const savedQuiz = await newQuiz.save();
  

//       res.status(201).json(savedQuiz);
//     } catch (error) {
//       console.error('Error adding quiz:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

quizRouter.post('/:deckId', async (req, res) => {
    const data = req.body.data;
    const deckId = req.params.deckId;
  
    try {
      const newQuizIds = [];
  
      for (const item of data) {
        const newQuiz = new Quiz({
          quiz_question: item.quiz_question,
          quiz_choice: item.quiz_choice,
          quiz_answerCorrect: item.quiz_answerCorrect,
          deck_id: item.deck_id,
          stat: 0
        });
  
        const savedQuiz = await newQuiz.save();
        newQuizIds.push(savedQuiz._id);

        const checkFlashcard = await Flashcard.findOne({ card_question: item.quiz_question });
        if (checkFlashcard) {
          await Quiz.findByIdAndUpdate(savedQuiz._id, { $set: { flashcard_id: checkFlashcard._id } });
        }
      }
      
      await Deck.findOneAndUpdate(
        { _id: deckId },
        { $push: { quizzes: { $each: newQuizIds } } },
        { new: true }
      );
      res.status(201).json(newQuizIds); 
      
      

      // res.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ', updatedDeck });
    } catch (error) {
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
  });

module.exports = quizRouter;
