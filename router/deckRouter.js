const express = require('express');
const deckRouter = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/Deck');
const Classroom = require('../models/Classroom');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');

// Get Router สำหรับค้นหา deck ทั้งหมด
deckRouter.get('/', (req, res, next) => {
  Deck.find()
    .populate('flashcard')
    .then((decks) => {
      res.json(decks);
    })
    .catch((err) => {
      next(err);
    });
});

deckRouter.get('/ById/:id', (req, res, next) => {
  Deck.findById(req.params.id)
    .then((Deck) => {
      res.json(Deck);
    })
    .catch((err) => {
      next(err);
    });
});

deckRouter.get('/findId/:id', async (req, res, next) => {
  try {
    // ดึง id ของ flashcard ทั้งหมดที่อยู่ในเอกสาร quiz
    const quizFlashcardIds = await Quiz.distinct('flashcard_id', { deck_id: req.params.id });

    // ดึง flashcard ที่ไม่ถูกอ้างอิงโดยเอกสาร quiz ใด ๆ เฉพาะ _id
    const flashcardsNotInQuiz = await Flashcard.find({
      deck_id: req.params.id,
      _id: { $nin: quizFlashcardIds } // $nin หมายถึง "not in"
    })

    res.json(flashcardsNotInQuiz);
  } catch (err) {
    next(err);
  }
});


// Get Router สำหรับค้นหา Deck ตาม classroom_id
deckRouter.get('/:classroom_id', (req, res, next) => {
  Deck.find({ classroom_id: req.params.classroom_id })
    .then((decks) => {
      res.json(decks);
    })
    .catch((err) => {
      next(err);
    }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Get Router สำหรับค้นหา deck ตาม id
deckRouter.get('/getById/:id', (req, res, next) => {
  Deck.findById(req.params.id)
    .populate('flashcards') // ใช้ method populate() เพื่อดึงข้อมูลจาก collection อื่นมาแสดง
    .then((decks) => {
      res.json(decks);
    })
    .catch((err) => {
      next(err);
    });
});

// Get Router สำหรับค้นหา Quiz ตาม id
deckRouter.get('/getByIdQuiz/:id', (req, res, next) => {
  Deck.findById(req.params.id)
    .populate('quizzes') // ใช้ method populate() เพื่อดึงข้อมูลจาก collection อื่นมาแสดง
    .populate('flashcards')
    .then((decks) => {
      res.json(decks);
    })
    .catch((err) => {
      next(err);
    });
});

// Post Router สำหรับสร้าง Deck
deckRouter.post('/', (req, res, next) => {
  Deck.create(req.body)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      next(err);
    }); // ใช้ method save() เพื่อบันทึกข้อมูลลงใน database
});

// Delete Router สำหรับลบ deck ตาม id
deckRouter.delete('/:id', (req, res, next) => {
  Deck.findByIdAndRemove(req.params.id, req.body)
    .then(() => {
      res.json({ message: 'Deleted' });
    })
    .catch((err) => {
      next(err);
    });
});

// Put Router สำหรับอัพเดทข้อมูล deck
deckRouter.put('/:id', (req, res, next) => {
  Deck.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: 'Updated' });
    })
    .catch((err) => {
      next(err);
    });
});

// Flashcard Router

// Get Flashcard ด้วย Deck ID
deckRouter.get('/flashcard/:deck_id', (req, res, next) => {
  Flashcard.find({ deck_id: req.params.deck_id })
    .populate('deck_id')
    .then((flashcards) => {
      res.json(flashcards);
    })
    .catch((err) => {
      next(err);
    });
});

// Get Flashcard With ID
deckRouter.get('/flashcard/getById/:id', (req, res, next) => {
  Flashcard.findById(req.params.id)
    .then((flashcards) => {
      res.json(flashcards);
    })
    .catch((err) => {
      next(err);
    });
});

// Put Flashcard
deckRouter.put('/flashcard/:id', (req, res, next) => {
  Flashcard.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: 'Updated' });
    })
    .catch(() => {
      next(err);
    })
})

// Delete Flashcard
deckRouter.delete('/flashcard/:id', (req, res, next) => {
  Flashcard.findByIdAndRemove(req.params.id, req.body)
    .then(() => {
      res.json({ message: 'Deleted' });
    })
    .catch((err) => {
      next(err);
    });
});

// Get Quiz With DeckId
deckRouter.get('/quiz/:deck_id', (req, res, next) => {
  Quiz.find({ deck_id: req.params.deck_id })
    .populate('deck_id')
    .then((quizzes) => {
      res.json(quizzes);
    })
    .catch((err) => {
      next(err);
    });
});

// Get Quiz With ID
deckRouter.get('/quiz/getById/:id', (req, res, next) => {
  Quiz.findById(req.params.id)
    .then((quizzes) => {
      res.json(quizzes);
    })
    .catch((err) => {
      next(err);
    });
});

// Put Quiz - Update Quiz by ID
deckRouter.put('/quiz/update/:id', (req, res, next) => {
  Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(() => {
      res.json({ message: 'Quiz updated' });
    })
    .catch((err) => {
      next(err);
    });
});

// Delete Quiz
deckRouter.delete('/quiz/del/:id', (req, res, next) => {
  Quiz.findByIdAndRemove(req.params.id, req.body)
    .then(() => {
      res.json({ message: 'Deleted' });
    })
    .catch((err) => {
      next(err);
    });
});

// Get Compare Flashcard and Quiz
deckRouter.get('/compareflashcardAndQuiz/:deck_id', async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({ deck_id: req.params.deck_id });
    const quizzes = await Quiz.find({ deck_id: req.params.deck_id });

    if (!flashcards || !quizzes) {
      res.status(404).json({ message: 'Flashcards หรือ Quizzes ไม่พบใน database' });
    } else if (flashcards.length === quizzes.length) {
      res.json({ message: 'Success' });
    } else {
      res.json({ message: 'กรุณาสร้าง Quiz ให้เท่ากับจำนวนของ Flashcard' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = deckRouter;