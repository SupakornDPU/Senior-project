const express = require('express');
const adminRouter = express.Router();
const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const Flashcard = require('../models/Flashcard');

// สร้าง route สำหรับ get ข้อมูล teacher
adminRouter.get('/teacher', (req, res, next) => {
   Teacher.find()
      .then((teachers) => {
         res.json(teachers);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// route สำหรับ delete ข้อมูล teacher
adminRouter.delete('/teacher/:id', (req, res, next) => {
   Teacher.findByIdAndDelete(req.params.id)
      .then(() => {
         res.json({ message: 'Teacher deleted' });
      })
      .catch((err) => {
         next(err);
      });
});

// สร้าง route สำหรับ get ข้อมูล student
adminRouter.get('/student', (req, res, next) => {
   Student.find()
      .then((students) => {
         res.json(students);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// route สำหรับ delete ข้อมูล student
adminRouter.delete('/student/:id', (req, res, next) => {
   Student.findByIdAndDelete(req.params.id)
      .then(() => {
         res.json({ message: 'Student deleted' });
      })
      .catch((err) => {
         next(err);
      });
});

// สร้าง route สำหรับ get ข้อมูล classroom
adminRouter.get('/classroom', (req, res, next) => {
   Classroom.find()
      .then((classrooms) => {
         res.json(classrooms);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// route สำหรับ delete ข้อมูล classroom
adminRouter.delete('/classroom/:id', (req, res, next) => {
   Classroom.findByIdAndDelete(req.params.id)
      .then(() => {
         // ลบข้อมูลของห้องเรียนที่เกี่ยวข้องออกจาก collection student โดยใช้ method updateMany() ใช้สำหรับอัพเดทหลายๆ ข้อมูลใน collection
         // และใช้ method $pull ในการลบข้อมูลออกจาก array โดยจะหา classroom ที่มี id ตรงกับ req.params.id แล้วลบออก
         Student.updateMany(
            { classroom: new mongoose.Types.ObjectId(req.params.id) }, // 
            { $pull: { classroom: new mongoose.Types.ObjectId(req.params.id) } }
         )
         res.json({ message: 'Classroom deleted' });
      })
      .catch((err) => {
         next(err);
      });
});

// route สำหรับ get ข้อมูล flashcard
adminRouter.get('/flashcard', (req, res, next) => {
   Flashcard.find()
      .then((flashcards) => {
         res.json(flashcards);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// route สำหรับ delete ข้อมูล flashcard
adminRouter.delete('/flashcard/:id', (req, res, next) => {
   Flashcard.findByIdAndDelete(req.params.id)
      .then(() => {
         res.json({ message: 'Flashcard deleted' });
      })
      .catch((err) => {
         next(err);
      });
});

module.exports = adminRouter;