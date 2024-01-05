const express = require('express');
const adminRouter = express.Router();
const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const Deck = require('../models/Deck');
const Flashcard = require('../models/Flashcard');

// Get Router สำหรับค้นหาอาจารย์ทั้งหมด
adminRouter.get('/teacher', (req, res, next) => {
  Teacher.find()
    .then((teachers) => {
      res.json(teachers);
    })
    .catch((err) => {
      next(err);
    }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Delete Router สำหรับลบอาจารย์
adminRouter.delete('/teacher/:id', (req, res, next) => {
  Teacher.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: 'ลบอาจารย์เสร็จสิ้น' });
    })
    .catch((err) => {
      next(err);
    });
});

// Post Router สำหรับเพิ่ม Teacher
adminRouter.post('/teacher/create', (req, res, next) => {
  Teacher.findOne({ user_email: req.body.user_email })
    .then((teacher) => {
      if (teacher) {
        return res.status(400).json({ message: "อีเมล์นี้มีผู้ใช้งานแล้ว" });
      } else {
        Teacher.create(req.body)
          .then((post) => {
            res.json(post);
          })
          .catch((err) => {
            next(err);
          });
      }
    })
});

// Get Router สำหรับค้นหานักเรียนทั้งหมด
adminRouter.get('/student', (req, res, next) => {
  Student.find()
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      next(err);
    }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Delete Router สำหรับลบนักเรียน
adminRouter.delete('/student/:id', (req, res, next) => {
  Student.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: 'ลบนักเรียนเสร็จสิ้น' });
    })
    .catch((err) => {
      next(err);
    });
});

// Post Router สำหรับเพิ่ม Student
adminRouter.post('/student/create', (req, res, next) => {
  Student.findOne({ user_email: req.body.user_email })
    .then((student) => {
      if (student) {
        return res.status(400).json({ message: "อีเมล์นี้มีผู้ใช้งานแล้ว" });
      } else {
        Student.create(req.body)
          .then((post) => {
            res.json(post);
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Get Router สำหรับค้นหาห้องเรียนทั้งหมด
adminRouter.get('/classroom', (req, res, next) => {
  Classroom.find()
    .then((classrooms) => {
      res.json(classrooms);
    })
    .catch((err) => {
      next(err);
    }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Delete Router สำหรับ Delete Classroom
adminRouter.delete('/classroom/:id', (req, res, next) => {
  Classroom.findByIdAndDelete(req.params.id)
    .then(() => {
      // ลบข้อมูลของห้องเรียนที่เกี่ยวข้องออกจาก collection student โดยใช้ method updateMany() ใช้สำหรับอัพเดทหลายๆ ข้อมูลใน collection
      // และใช้ method $pull ในการลบข้อมูลออกจาก array โดยจะหา classroom ที่มี id ตรงกับ req.params.id แล้วลบออก
      Student.updateMany(
        { classroom: new mongoose.Types.ObjectId(req.params.id) }, // 
        { $pull: { classroom: new mongoose.Types.ObjectId(req.params.id) } }
      )
      res.json({ message: 'ลบห้องเรียนเสร็จสิ้น' });
    })
    .catch((err) => {
      next(err);
    });
});

// Logic สำหรับสร้างรหัสสุ่ม 6 ตัวอักษร
const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  // สุ่มตัวอักษร 6 ตัว จาก characters ที่กำหนด แล้วนำมาต่อกัน แล้ว return ออกมา
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

// ตรวจสอบว่ามีรหัสนี้ในฐานข้อมูลหรือยัง
const isCodeUnique = async (code) => {
  const existingClassroom = await Classroom.findOne({ code });
  return !existingClassroom;
};

// สร้างรหัสใหม่ และตรวจสอบความซ้ำกัน
const generateUniqueCode = async () => {
  let code;
  do {
    code = generateRandomCode(); // สร้างรหัส
  } while (!(await isCodeUnique(code))); // ตรวจสอบความซ้ำ
  return code;
};

// Post Router สำหรับเพิ่ม Classroom
adminRouter.post('/classroom/create', (req, res, next) => {
  req.body.classroom_code = generateRandomCode();
  Classroom.create(req.body)
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      next(err);
    })
});

// Get Router สำหรับค้นหา Deck ทั้งหมด
adminRouter.get('/deck', (req, res, next) => {
  Deck.find()
    .then((decks) => {
      res.json(decks);
    })
    .catch((err) => {
      next(err);
    });
});

const upload = multer({ dest: "data/" }); // เป็นการบอกว่าไฟล์ที่อัพโหลดจะถูกเก็บไว้ที่โฟลเดอร์ไหน

// Post Router สำหรับสร้าง FlashCard และอัปโหลดไฟล์ excel
adminRouter.post('/import/:deckId', (upload.single('file')), (req, res, next) => {
  console.log(req.file);
  try {

    if (req.file.filename == null || req.file.filename == undefined) {
      res.status(400).send('No file uploaded.');

    } else {
      const filePath = "data/" + req.file.filename; // ตั้งชื่อไฟล์ที่จะเก็บข้อมูล excel

      const excelData = excelToJson({
        sourceFile: filePath,
        header: {
          rows: 1
        },
        columnToKey: {
          A: 'card_question',
          B: 'card_answer'
        }
      });
      let allData = [];
      for (let sheet in excelData) {
        allData = allData.concat(excelData[sheet]);
      }
      res.status(200).json(allData);
      // console.log(allData);
      fs.remove(filePath); // Delete excel file

      // Insert data to database
      const deck_id = req.params.deckId;
      allData = allData.map(item => ({ ...item, deck_id }));
      Flashcard.insertMany(allData)
        .then((insertedDocuments) => {
          console.log(insertedDocuments);
          // สร้าง array ของ _id จาก insertedDocuments
          let flashcardIds = insertedDocuments.map(doc => doc._id);

          // ใช้ $addToSet กับ $each เพื่อเพิ่มทุก _id ใน flashcardIds ลงใน flashcards ของ Deck
          return Deck.findByIdAndUpdate(deck_id, { $addToSet: { flashcards: { $each: flashcardIds } } }, { new: true });
        })
        .then(updatedDeck => {
          console.log(updatedDeck);
          console.log('Inserted data to database and updated the decks.');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    next(error);
  }
});

// Post Router สำหรับสร้าง FlashCard สำหรับ form ที่ส่งมาจาก Client
adminRouter.post('/:deckId', async (req, res) => {
  const data = req.body.data;
  const deckId = req.params.deckId;

  try {
    const newFlashcardIds = [];

    // วนซ้ำเพื่อบันทึกข้อมูล FlashCard
    for (const item of data) {
      const newQA = new Flashcard({
        "card_question": item.question,
        "card_answer": item.answer,
        "deck_id": item.deckid,
      });

      // บันทึกแฟลชการ์ดและบันทึกรหัสที่สร้างขึ้น
      const savedFlashcard = await newQA.save();
      newFlashcardIds.push(savedFlashcard._id); // _id เป็น ObjectId ที่สร้างขึ้น
    }

    // อัปเดตสำรับด้วยรหัสแฟลชการ์ดใหม่
    const updatedDeck = await Deck.findOneAndUpdate(
      { _id: deckId },
      { $push: { flashcards: { $each: newFlashcardIds } } },
      { new: true }
    );

    res.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ', updatedDeck });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});

// Get Router สำหรับค้นหาข้อมูล flashcard ทั้งหมด
adminRouter.get('/flashcard', (req, res, next) => {
  Flashcard.find()
    .then((flashcards) => {
      res.json(flashcards);
    })
    .catch((err) => {
      next(err);
    }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

// Delete Router สำหรับลบข้อมูล flashcard
adminRouter.delete('/flashcard/:id', (req, res, next) => {
  Flashcard.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: 'ลบแฟลชการ์ดเสร็จสิ้น' });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = adminRouter;