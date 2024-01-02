const express = require('express');
const studentRouter = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

// Get Router สำหรับค้นหานักเรียนทั้งหมด
studentRouter.get('/', (req, res, next) => {
   Student.find()
      .populate('classroom')  // ใช้ method populate() เพื่อดึงข้อมูลจาก collection อื่นมาแสดง
      .then((students) => {
         res.json(students);
      })
      .catch((err) => {
         next(err);
      });
});

// Post Router สำหรับสร้างนักเรียน
studentRouter.route('/:id')
   .get((req, res, next) => {
      Student.findById(req.params.id)
         .populate('classroom')
         .then((students) => {
            res.json(students);
         })
         .catch((err) => {
            next(err);
         });
   })

   // Put Router สำหรับอัพเดทข้อมูลนักเรียน
   .put((req, res, next) => {
      const { classroom } = req.body;  // classroom คือรหัสห้องเรียนที่ส่งมาจากฝั่ง Client

      Classroom.findOne({ classroom_code: classroom }).then((classroom) => { // ค้นหาว่ามีห้องเรียนที่มีรหัสตรงกับ classroom code ที่ส่งมาหรือไม่
         if (!classroom) {
            return res.status(400).json({
               message: 'ไม่พบห้องเรียนที่คุณต้องการเข้าร่วม',
            });
         } else if (classroom) { // ถ้ามีรหัสที่ตรงกัน ให้ทำการอัพเดทข้อมูลลงใน Collection student โดยอัพเดทรหัสห้องเรียนลงใน Array classroom
            Student.findOne({ classroom: classroom }).then((student) => {
               if (student) {
                  return res.status(400).json({
                     message: 'คุณได้เข้าร่วมห้องเรียนนี้แล้ว',
                  });
               } else {
                  Student.findByIdAndUpdate(req.params.id, { $addToSet: { classroom: classroom._id } }, { new: true })
                     .then((result) => {
                        res.status(200).json(result);
                     })
                     .catch((err) => {
                        next(err);
                     });
               }
            })
         }
      }).catch((err) => {
         next(err);
      });
   })

    // Delete Router สำหรับลบ Classroom ตาม id
   .delete((req, res, next) => {
   Student.findById(req.params.id)
      .then((student) => {
         if (student) {
            Student.findByIdAndUpdate(req.params.id, { $pull: { classroom: req.body.classroomId } }, { new: true })
               .then((result) => {
                  res.status(200).json(result);
               })
               .catch((err) => {
                  next(err);
               });
         } else {
            res.status(404).json({
               message: 'ไม่พบข้อมูลนักเรียนที่ต้องการลบ',
            });
         }
      })
      .catch((err) => {
         next(err);
      });
   });

module.exports = studentRouter;