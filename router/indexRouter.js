const express = require('express');
const indexRouter = express.Router();
const mongoose = require('mongoose');

// สร้าง route สำหรับส่งข้อมูลไปยังหน้า index
indexRouter.get('/', (req, res, next) => {
   res.json({loggedIn, role}); // ส่งตัวแปร global loggedIn ไปให้หน้า index
});

module.exports = indexRouter;