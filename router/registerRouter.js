const express = require('express');
const registerRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/Users');

// สร้าง route สำหรับ get ข้อมูล user
registerRouter.get('/', (req, res, next) => {
   User.find()
      .then((users) => {
         res.json(users);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// สร้าง route สำหรับ post ข้อมูล user
registerRouter.post('/', (req, res, next) => {
   User.create(req.body)
      .then((post) => {
         res.json(post);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method create() เพื่อสร้างข้อมูล และรับข้อมูลผ่าน req.body ที่ส่งมา
})

// สร้าง route สำหรับ get ข้อมูล user ตาม id
registerRouter.get('/:id', (req, res, next) => {
   User.findById(req.params.id)
      .then((user) => {
         res.json(user);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method findById() เพื่อค้นหาข้อมูลตาม id ที่ส่งมา
});

// สร้าง route สำหรับ put ข้อมูล user ตาม id
registerRouter.put('/:id', (req, res, next) => {
   User.findByIdAndUpdate(req.params.id, req.body)
      .then(() => {
         res.json({ message: 'Updated' });
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method findByIdAndUpdate() เพื่อค้นหาข้อมูลตาม id และทำการอัพเดทข้อมูล
});

// สร้าง route สำหรับ delete ข้อมูล user ตาม id
registerRouter.delete('/:id', (req, res, next) => {
   User.findByIdAndRemove(req.params.id, req.body)
      .then(() => {
         res.json({ message: 'Deleted' });
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method findByIdAndRemove() เพื่อค้นหาข้อมูลตาม id และทำการลบข้อมูล
});

module.exports = registerRouter;