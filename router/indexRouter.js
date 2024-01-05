const express = require('express');
const indexRouter = express.Router();
const mongoose = require('mongoose');

// Get Router สำหรับนำ Session มาใช้
indexRouter.get('/', (req, res, next) => {
  res.json({ userName, loggedIn, role }); // ส่งตัวแปร global loggedIn ไปให้หน้า index
});

module.exports = indexRouter;