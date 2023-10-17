const express = require('express');
const deckRouter = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/Deck');

// สร้าง route สำหรับ get ข้อมูล deck ตาม Classroom_id ที่รับค่ามาจาก parameter
deckRouter.get('/:classroom_id', (req, res, next) => {
   Deck.find({ classroom_id: req.params.classroom_id})
      .then((decks) => {
         res.json(decks);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// สร้าง route สำหรับ post ข้อมูล deck
deckRouter.post('/', (req, res, next) => {
   Deck.create(req.body)
      .then((result) => {
         res.status(201).json(result);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method save() เพื่อบันทึกข้อมูลลงใน database
});

module.exports = deckRouter;