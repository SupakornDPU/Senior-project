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

   const { classroom_id } = req.body;

   Deck.find({ classroom_id: classroom_id }).then((classroom_id) => {
      if (!classroom_id) {
         return res.status(400).json({
            message: 'Classroom not found',
         });
      } else if (classroom_id) { // ถ้ามีรหัสที่ตรงกัน ให้ทำการอัพเดทข้อมูลลงใน Collection student โดยอัพเดทรหัสห้องเรียนลงใน Array classroom
         Classroom.findByIdAndUpdate(req.params.id, { $addToSet: { deck: classroom_id._id } }, { new: true })
            .then((result) => {
               res.status(200).json(result);
            })
            .catch((err) => {
               next(err);
            });
      }
   });



});
module.exports = deckRouter;