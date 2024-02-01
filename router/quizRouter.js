const express = require('express');
const quizRouter = express.Router();
const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');

quizRouter.get('/', (req, res, next) => {
    Quiz.find()
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

quizRouter.post('/:deckId', async (req, res) => {
    try {
      const deckId = req.params.deckId;
      const quizData = req.body.data;
  
      const newQuiz = new Quiz({
        quiz_question: quizData.quiz_question,
        quiz_choice: quizData.quiz_choice,
        quiz_answerCorrect: quizData.quiz_answerCorrect,
        deck_id: deckId,
      });
  
      // บันทึกลงฐานข้อมูล
      const savedQuiz = await newQuiz.save();
  

      res.status(201).json(savedQuiz);
    } catch (error) {
      console.error('Error adding quiz:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = quizRouter;
