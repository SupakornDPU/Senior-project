const express = require('express');
const deckRouter = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/Deck');
const Classroom = require('../models/Classroom');

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

module.exports = deckRouter;