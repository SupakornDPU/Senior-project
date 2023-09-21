const express = require('express');
const path = require('path');
const logger = require('./logger');
const userRouter = require('./router/userRouter');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Init middleware
app.use(logger);  // เรียกใช้ logger middleware

app.use('/projectsenior/user', userRouter);  // เรียกใช้ userRouter

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// กำหนด port ให้กับ server
const port = process.env.PORT || 5000;

// ใช้คำสั่งนี้เพื่อรัน server
app.listen(port, () => console.log(`Server running on port ${port}`));