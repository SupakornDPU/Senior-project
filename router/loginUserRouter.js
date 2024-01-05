const express = require('express');
const loginUserRouter = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt');

// Post Router สำหรับ login compare password
loginUserRouter.post('/', (req, res, next) => {
  const { user_email, user_password, user_role } = req.body;

  Student.findOne({ user_email: user_email }).then(user => {
    console.log(user);

    if (user) {
      let cmp = bcrypt.compare(user_password, user.user_password).then((match) => {
        if (match) {
          req.session.userName = user.user_firstname + ' ' + user.user_lastname;
          req.session.userId = user._id; // ใช้คำสั่งนี้เพื่อเก็บ session ของ user ที่ login เข้ามา โดยเก็บเป็น id ใส่ในตัวแปร userId
          req.session.userRole = 'Student'; // ใช้คำสั่งนี้เพื่อเก็บ session ของ user ที่ login เข้ามา โดยเก็บเป็น role ใส่ในตัวแปร userRole
          res.json({ message: "Login Success" })
        } else {
          res.json({ message: "Login Fail" })
        }
      })
    } else if (!user) {
      // res.json({message: "Login Fail"})
      Teacher.findOne({ user_email: user_email }).then(user => {
        console.log(user);

        if (user) {
          let cmp = bcrypt.compare(user_password, user.user_password).then((match) => {
            if (match) {
              req.session.userName = user.user_firstname + ' ' + user.user_lastname;
              req.session.userId = user._id; // ใช้คำสั่งนี้เพื่อเก็บ session ของ user ที่ login เข้ามา โดยเก็บเป็น id ใส่ในตัวแปร userId
              req.session.userRole = 'Teacher'; // ใช้คำสั่งนี้เพื่อเก็บ session ของ user ที่ login เข้ามา โดยเก็บเป็น role ใส่ในตัวแปร userRole
              res.json({ message: "Login Success" })
            } else {
              res.json({ message: "Login Fail" })
            }
          })
        } else if (!user) {
          res.json({ message: "Login Fail" })
        }
      })
    } else {
      res.json({ message: "Login Fail" })
    }
  });
});

module.exports = loginUserRouter;