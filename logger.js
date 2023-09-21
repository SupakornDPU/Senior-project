// Logger middleware คือ middleware ที่ใช้สำหรับเก็บ log ข้อมูลต่างๆ ที่เกิดขึ้นในระบบ
const logger = (req, res, next) => {
   console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
   next();
};

module.exports = logger;