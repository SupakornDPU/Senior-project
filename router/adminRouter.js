const express = require('express');
const adminRouter = express.Router();
const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const Flashcard = require('../models/Flashcard');

// Get Router สำหรับค้นหาอาจารย์ทั้งหมด
adminRouter.get('/teacher', (req, res, next) => {
   Teacher.find()
      .then((teachers) => {
         res.json(teachers);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Delete Router สำหรับลบอาจารย์
adminRouter.delete('/teacher/:id', (req, res, next) => {
   Teacher.findByIdAndDelete(req.params.id)
      .then(() => {
         res.json({ message: 'ลบอาจารย์เสร็จสิ้น' });
      })
      .catch((err) => {
         next(err);
      });
});

// Post Router สำหรับเพิ่ม Teacher
adminRouter.post('/teacher/create', (req, res, next) => {
   Teacher.findOne({ user_email: req.body.user_email })
   .then((teacher) => {
      if (teacher) {
         return res.status(400).json({ message: "อีเมล์นี้มีผู้ใช้งานแล้ว" });
      } else {
         Teacher.create(req.body)
            .then((post) => {
               res.json(post);
            })
            .catch((err) => {
               next(err);
            });
      }
   })
});

// Get Router สำหรับค้นหานักเรียนทั้งหมด
adminRouter.get('/student', (req, res, next) => {
   Student.find()
      .then((students) => {
         res.json(students);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Delete Router สำหรับลบนักเรียน
adminRouter.delete('/student/:id', (req, res, next) => {
   Student.findByIdAndDelete(req.params.id)
      .then(() => {
         res.json({ message: 'ลบนักเรียนเสร็จสิ้น' });
      })
      .catch((err) => {
         next(err);
      });
});

// Post Router สำหรับเพิ่ม Student
adminRouter.post('/student/create', (req, res, next) => {
   Student.findOne({ user_email: req.body.user_email })
   .then((student) => {
      if (student) {
         return res.status(400).json({ message: "อีเมล์นี้มีผู้ใช้งานแล้ว" });
      } else {
         Student.create(req.body)
            .then((post) => {
               res.json(post);
            })
            .catch((err) => {
               next(err);
            });
      }
   })
   .catch((err) => {
      next(err);
   });
});

// Get Router สำหรับค้นหาห้องเรียนทั้งหมด
adminRouter.get('/classroom', (req, res, next) => {
   Classroom.find()
      .then((classrooms) => {
         res.json(classrooms);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Delete Router สำหรับลบห้องเรียน
adminRouter.delete('/classroom/:id', (req, res, next) => {
   Classroom.findByIdAndDelete(req.params.id)
      .then(() => {
         // ลบข้อมูลของห้องเรียนที่เกี่ยวข้องออกจาก collection student โดยใช้ method updateMany() ใช้สำหรับอัพเดทหลายๆ ข้อมูลใน collection
         // และใช้ method $pull ในการลบข้อมูลออกจาก array โดยจะหา classroom ที่มี id ตรงกับ req.params.id แล้วลบออก
         Student.updateMany(
            { classroom: new mongoose.Types.ObjectId(req.params.id) }, // 
            { $pull: { classroom: new mongoose.Types.ObjectId(req.params.id) } }
         )
         res.json({ message: 'ลบห้องเรียนเสร็จสิ้น' });
      })
      .catch((err) => {
         next(err);
      });
});

// Get Router สำหรับค้นหาข้อมูล flashcard ทั้งหมด
adminRouter.get('/flashcard', (req, res, next) => {
   Flashcard.find()
      .then((flashcards) => {
         res.json(flashcards);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Delete Router สำหรับลบข้อมูล flashcard
adminRouter.delete('/flashcard/:id', (req, res, next) => {
   Flashcard.findByIdAndDelete(req.params.id)
      .then(() => {
         res.json({ message: 'ลบแฟลชการ์ดเสร็จสิ้น' });
      })
      .catch((err) => {
         next(err);
      });
});

module.exports = adminRouter;