const express = require('express');
const registerRouter = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// สร้าง route สำหรับ get ข้อมูล teacher และ student
registerRouter.get('/', (req, res, next) => {
   Teacher.find()
      .then(teachers => {
         return Student.find()
            .then(students => {
               res.json({ teachers, students });
            })
            .catch(err => {
               throw err; // ส่ง error ไปยัง catch สุดท้าย
            });
      })
      .catch(err => {
         next(err);
      });
});

// สร้าง route สำหรับ post ข้อมูล teacher และ student
registerRouter.post('/', (req, res, next) => {
   const { user_role } = req.body;
   Teacher.findOne({ user_email: req.body.user_email }).then((teacher) => {
      Student.findOne({ user_email: req.body.user_email }).then((student) => {
         if (teacher || student) {
            return res.status(400).json({ message: "Email already exists" });
         } else {
            if (user_role == "Teacher") {
               Teacher.create(req.body)
                  .then((post) => {
                     res.json(post);
                  })
                  .catch((err) => {
                     next(err);
                  }); // ใช้ method create() เพื่อสร้างข้อมูล และรับข้อมูลผ่าน req.body ที่ส่งมา
            } else if (user_role == "Student") {
               Student.create(req.body)
                  .then((post) => {
                     res.json(post);
                  })
                  .catch((err) => {
                     next(err);
                  }); // ใช้ method create() เพื่อสร้างข้อมูล และรับข้อมูลผ่าน req.body ที่ส่งมา
            }
         }
      });
   })
})

module.exports = registerRouter;