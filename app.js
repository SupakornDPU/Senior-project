const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const logger = require('./logger');

// ! Router
const registerRouter = require('./router/registerRouter');
const loginUserRouter = require('./router/loginUserRouter');
const loginRouter = require('./router/loginRouter');
const classroomRouter = require('./router/classroomRouter');
const indexRouter = require('./router/indexRouter');
const deckRouter = require('./router/deckRouter');
const studentRouter = require('./router/studentRouter');
const adminRouter = require('./router/adminRouter');
const flashcardRouter = require('./router/flashcardRouter');

// ! ตั้งค่าการเชื่อมต่อฐานข้อมูล
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://644607030002:1234@cluster0.f8qfgb3.mongodb.net/pyflash', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err));

const app = express();

// สร้างตัวแปร global เพื่อเก็บ session ของ user ที่ login เข้ามา
global.loggedIn = null;
global.role = null;
global.userName = null;

// ! Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ! Express session middleware เอาไว้เก็บ session ของ user เพื่อใช้ในการตรวจสอบสิทธิ์การเข้าถึงหน้าต่างๆ
app.use(expressSession({
      secret: 'node secret',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 3 * 60 * 60 * 1000 }
}))
app.use("*", (req, res, next) => {
      userName = req.session.userName;
      loggedIn = req.session.userId;
      role = req.session.userRole;
      next();
});

// ! Init middleware
app.use(logger);  // เรียกใช้ logger middleware

app.use('/projectsenior/index', indexRouter);  // เรียกใช้ indexRouter เพื่อส่งตัวแปร global loggedIn ไปให้หน้า index
app.use('/projectsenior/register', registerRouter);  // เรียกใช้ registerRouter
app.use('/projectsenior/loginUser', loginUserRouter);  // เรียกใช้ loginUserRouter
app.use('/projectsenior/logout', loginRouter);  // เรียกใช้ loginRouter เพื่อทำการ logout
app.use('/projectsenior/classroom', classroomRouter);  // เรียกใช้ classroomRouter
app.use('/projectsenior/deck', deckRouter);  // เรียกใช้ deckRouter
app.use('/projectsenior/student', studentRouter);  // เรียกใช้ studentRouter
app.use('/projectsenior/admin', adminRouter);  // เรียกใช้ adminRouter
app.use('/projectsenior/flashcard', flashcardRouter);  // เรียกใช้ flashcardRouter

// ! Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public', {
      extensions: ['html'],
}));

// ! Set 404 page
app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ! กำหนด port ให้กับ server
const port = process.env.PORT || 5000;

// ! ใช้คำสั่งนี้เพื่อรัน server
app.listen(port, () => console.log(`Server running on port ${port}`));