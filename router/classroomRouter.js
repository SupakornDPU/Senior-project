const express = require('express');
const classroomRouter = express.Router();
const mongoose = require('mongoose');
const Classroom = require('../models/Classroom');
const Student = require('../models/Student');
const Deck = require('../models/Deck');

// Get Router สำหรับค้นหาห้องเรียนทั้งหมด
classroomRouter.get('/', (req, res, next) => {
   Classroom.find()
      .then((classrooms) => {
         res.json(classrooms);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Logic สำหรับสร้างรหัสสุ่ม 6 ตัวอักษร
const generateRandomCode = () => {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   let code = '';

   // สุ่มตัวอักษร 6 ตัว จาก characters ที่กำหนด แล้วนำมาต่อกัน แล้ว return ออกมา
   for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
   }

   return code;
};

// ตรวจสอบว่ามีรหัสนี้ในฐานข้อมูลหรือยัง
const isCodeUnique = async (code) => {
   const existingClassroom = await Classroom.findOne({ code });
   return !existingClassroom;
};

// สร้างรหัสใหม่ และตรวจสอบความซ้ำกัน
const generateUniqueCode = async () => {
   let code;
   do {
      code = generateRandomCode(); // สร้างรหัส
   } while (!(await isCodeUnique(code))); // ตรวจสอบความซ้ำ
   return code;
};

// Post Router สำหรับสร้างห้องเรียน
classroomRouter.post('/', (req, res, next) => {
   req.body.classroom_code = generateRandomCode();
   Classroom.create(req.body)
      .then((post) => {
         res.json(post);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method create() เพื่อสร้างข้อมูล และรับข้อมูลผ่าน req.body ที่ส่งมา
});

// Get Router สำหรับค้นหาห้องเรียนตาม id
classroomRouter.get('/:id', (req, res, next) => {
   Classroom.findById(req.params.id)
      .then((classroom) => {
         res.json(classroom);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method findById() เพื่อค้นหาข้อมูลตาม id ที่ส่งมา
});

// Put Router สำหรับอัพเดทข้อมูลห้องเรียน
classroomRouter.put('/:id', (req, res, next) => {
   Classroom.findByIdAndUpdate(req.params.id, req.body)
      .then(() => {
         res.json({ message: 'Updated' });
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method findByIdAndUpdate() เพื่อค้นหาข้อมูลตาม id และทำการอัพเดทข้อมูล
});

// Delete Router สำหรับลบข้อมูลห้องเรียน
classroomRouter.delete('/:id', async (req, res, next) => {  // async คือการบอกว่าเป็น function ที่มีการทำงานแบบ asynchronous คือ มีการทำงานที่ไม่จำเป็นต้องรอให้เสร็จก่อน
   try {
      const id = req.params.id;
      await Classroom.findByIdAndRemove(id); // await คือการบอกว่าให้รอให้ function ที่เราเรียกใช้เสร็จก่อน แล้วค่อยทำต่อ
      await Student.updateMany(
         { classroom: id },
         { $pull: { classroom: id } }
      );
      await Deck.deleteMany({ classroom_id: id });
      res.json({ message: 'Deleted' });
   } catch (err) {
      next(err);
   }
});

module.exports = classroomRouter;