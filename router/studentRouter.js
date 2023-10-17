const express = require('express');
const studentRouter = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

// สร้าง route สำหรับ get ข้อมูล student
studentRouter.get('/', (req, res, next) => {
   Student.find()
      .then((students) => {
         res.json(students);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// PUT Classroom_id โดยอิงจาก id ของ Student
studentRouter.put('/:id', (req, res, next) => {
   const { classroom } = req.body;
   Classroom.findOne({ classroom_code: classroom }).then((classroom) => {
      if (!classroom) {
         return res.status(400).json({
            message: 'Classroom not found',
         });
      } else if (classroom) {
         Student.findByIdAndUpdate(req.params.id, { $addToSet: { classroom: classroom._id }}, { new: true })
            .then((result) => {
               res.status(200).json(result);
            })
            .catch((err) => {
               next(err);
            });
      }
   });
});

module.exports = studentRouter;