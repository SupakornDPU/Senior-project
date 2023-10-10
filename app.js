const express = require('express');
const path = require('path');
const logger = require('./logger');
const registerRouter = require('./router/registerRouter');
const classroomRouter = require('./router/classroomRouter');
const mongoose = require('mongoose');
const expressSession = require('express-session');

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://644607030002:1234@cluster0.f8qfgb3.mongodb.net/pyflash' , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
})
      .then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err));

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session middleware เอาไว้เก็บ session ของ user เพื่อใช้ในการตรวจสอบสิทธิ์การเข้าถึงหน้าต่างๆ
app.use(expressSession({
      secret: "node secret"
}))

// Init middleware
app.use(logger);  // เรียกใช้ logger middleware

app.use('/projectsenior/user', registerRouter);  // เรียกใช้ registerRouter
app.use('/projectsenior/classroom', classroomRouter);  // เรียกใช้ classroomRouter

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// กำหนด port ให้กับ server
const port = process.env.PORT || 5000;

// ใช้คำสั่งนี้เพื่อรัน server
app.listen(port, () => console.log(`Server running on port ${port}`));