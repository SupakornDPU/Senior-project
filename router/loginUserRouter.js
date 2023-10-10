const express = require('express');
const loginUserRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/Users');
const bcrypt = require('bcrypt');

// เช็ค password ว่าตรงกับที่เราเข้าสู่ระบบมาหรือไม่
loginUserRouter.post('/', (req, res, next) => {
   const {user_email, user_password} = req.body;

   User.findOne({user_email: user_email}).then(user => {
      console.log(user);

      if (user) {
         let cmp = bcrypt.compare(user_password, user.user_password).then((match) => {
            if (match) {
               req.session.userId = user._id; // ใช้คำสั่งนี้เพื่อเก็บ session ของ user ที่ login เข้ามา โดยเก็บเป็น id ใส่ในตัวแปร userId
               res.json({message: "Login Success"})
            } else {
               res.json({message: "Login Fail"})
            }
         })
      } else {
         res.json({message: "Login Fail"})
      }
   });
});

module.exports = loginUserRouter;