const express = require('express');
const path = require('path');
const logger = require('./logger');
const registerRouter = require('./router/registerRouter');
const loginUserRouter = require('./router/loginUserRouter');
const loginRouter = require('./router/loginRouter');
const classroomRouter = require('./router/classroomRouter');
const indexRouter = require('./router/indexRouter');
const deckRouter = require('./router/deckRouter');
const mongoose = require('mongoose');
const expressSession = require('express-session');

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://644607030002:1234@cluster0.f8qfgb3.mongodb.net/pyflash' , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

const app = express();

// สร้างตัวแปร global เพื่อเก็บ session ของ user ที่ login เข้ามา
global.loggedIn = null;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session middleware เอาไว้เก็บ session ของ user เพื่อใช้ในการตรวจสอบสิทธิ์การเข้าถึงหน้าต่างๆ
app.use(expressSession({
      secret: "node secret"
}))
app.use("*", (req, res, next) => {
      loggedIn = req.session.userId;
      next();
});

// Init middleware
app.use(logger);  // เรียกใช้ logger middleware

app.use('/projectsenior/index', indexRouter);  // เรียกใช้ indexRouter เพื่อส่งตัวแปร global loggedIn ไปให้หน้า index
app.use('/projectsenior/register', registerRouter);  // เรียกใช้ registerRouter
app.use('/projectsenior/loginUser', loginUserRouter);  // เรียกใช้ loginUserRouter
app.use('/projectsenior/logout', loginRouter);  // เรียกใช้ loginRouter เพื่อทำการ logout
app.use('/projectsenior/classroom', classroomRouter);  // เรียกใช้ classroomRouter
app.use('/projectsenior/deck', deckRouter);  // เรียกใช้ deckRouter

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// กำหนด port ให้กับ server
const port = process.env.PORT || 5000;

// ใช้คำสั่งนี้เพื่อรัน server
app.listen(port, () => console.log(`Server running on port ${port}`));