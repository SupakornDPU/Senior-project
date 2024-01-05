const express = require('express');
const loginRouter = express.Router();

// Get Router สำหรับ Logout
loginRouter.get('/', (req, res, next) => {
  req.session.destroy(() => {
    res.json({ message: "Logout Success" })
  });
});

module.exports = loginRouter;