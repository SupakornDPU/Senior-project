const express = require('express');
const userRouter = express.Router();
const user = require('../data/Users');
const uuid = require('uuid');


// สร้าง route สำหรับ get ข้อมูล user
userRouter.get('/', (req, res) => {
   res.json(user);
});

// สร้าง route สำหรับ get ข้อมูล user ตาม id
userRouter.get('/:id', (req, res) => {

   // ใช้ method some() ในการหาข้อมูล user ที่มี id ตามที่ระบุ
   const found = user.some(user => user.id === parseInt(req.params.id));

   if (found) {
      // ถ้าพบข้อมูล user ที่มี id ตามที่ระบุ ให้ส่งข้อมูล user กลับไป
      res.json(user.filter(user => user.id === parseInt(req.params.id)));
   } else {
      // ถ้าไม่พบข้อมูล user ที่มี id ตามที่ระบุ ให้ส่งข้อความว่า No user with the id of {id} กลับไป
      res.status(400).json({ msg: `No user with the id of ${req.params.id}` });
   }
});

// Post user
userRouter.post('/', (req, res) => {

   const newUser = {
      id: uuid.v4(), // ใช้คำสั่ง uuid.v4 เพื่อสร้าง id ให้กับข้อมูลใหม่ที่เพิ่มเข้ามา
      name: req.body.name // ข้อมูลเมื่อมีการเพิ่มจะเข้าไปอยู่ใน req.body ซึ่งเราสามารถเข้าถึงได้
   }

   // เงื่อนไขเพื่อตรวจสอบว่ามีการส่งข้อมูล name และ email มาหรือไม่
   if (!newUser.name) {
      return res.status(400).json({ msg: 'Please include a name and email' }); // ใช้คำสั่ง return เพื่อให้หยุดการทำงานของ function นี้
   }

   user.push(newUser); // ใช้คำสั่ง push เพื่อเพิ่มข้อมูลใหม่ลงไปใน array
   res.json(user);  // ใช้คำสั่ง res.json เพื่อแสดงผลข้อมูลออกมาเป็น json
});

module.exports = userRouter;