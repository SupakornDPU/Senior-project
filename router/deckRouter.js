const express = require('express');
const deckRouter = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/Deck');
const Classroom = require('../models/Classroom');

// สร้าง route สำหรับ get ข้อมูล deck ตาม Classroom_id ที่รับค่ามาจาก parameter
deckRouter.get('/:classroom_id', (req, res, next) => {
   Deck.find({ classroom_id: req.params.classroom_id })
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

deckRouter.put('/:id', (req, res, next) => {
   Deck.find({ classroom_id: req.params.id })
      .then((decks) => {
         if (!decks || decks.length === 0) {
            return res.status(400).json({
               message: 'No matching decks found',
            });
         }
         // นำข้อมูลที่ได้จากการค้นหามาเก็บไว้ในตัวแปร deckIds โดยเก็บเป็น array ของ id เพื่อใช้ในการ update Classroom
         const deckIds = decks.map((deck) => deck._id);

         // นำข้อมูลที่อยู่ในตัวแปร deckIds มาเพิ่มเข้าไปใน Classroom ที่มี id ตรงกับ req.params.id
         Classroom.findByIdAndUpdate(req.params.id, { $addToSet: { deck: { $each: deckIds } } }, { new: true })
            .then((result) => {
               res.status(200).json(result);
            })
            .catch((err) => {
               next(err);
            });
      });
});
module.exports = deckRouter;