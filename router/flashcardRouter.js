const express = require('express');
const flashcardRouter = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs-extra');
const excelToJson = require('convert-excel-to-json');
const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');
const Quiz = require('../models/Quiz');

// Get Router สำหรับค้นหาข้อมูล FlashCard ทั้งหมด
flashcardRouter.get('/', (req, res, next) => {
  Flashcard.find()
    .then((flashcards) => {
      res.json(flashcards);
    })
    .catch((err) => {
      next(err);
    });
});

flashcardRouter.get('/getByIds/:id', (req, res, next) => {
  Flashcard.findById(req.params.id)
    .then((flashcards) => {
      res.json(flashcards);
    })
    .catch((err) => {
      next(err);
    });
});

const upload = multer({ dest: "data/" }); // เป็นการบอกว่าไฟล์ที่อัพโหลดจะถูกเก็บไว้ที่โฟลเดอร์ไหน

// Post Router สำหรับสร้าง FlashCard และอัปโหลดไฟล์ excel
flashcardRouter.post('/import/:deckId', (upload.single('file')), (req, res, next) => {
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
      allData = allData.map(item => ({ ...item, deck_id, stat: 0 }));
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

// Post Router สำหรับเพิ่ม FlashCard จาก Textarea
flashcardRouter.post('/:deckId', async (req, res) => {
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
        "stat": 0
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

// Put Router สำหรับบวกค่า stat ของ FlashCard
flashcardRouter.put('/stat', async (req, res) => {
  try {
    // สร้างอาร์เรย์เพื่อเก็บผลลัพธ์ของการอัปเดต Flashcard และ Quiz แต่ละตัว
    const updates = [];

    // Loop เพื่อแยก Key และ Value ของ req.body
    for (const [key, value] of Object.entries(req.body)) {
      console.log(`${key}: ${value}`);
      const flashcardId = key;
      console.log(flashcardId);

      const flashcard = await Flashcard.findById(flashcardId); // ค้นหา Flashcard โดยใช้ await
      const quiz = await Quiz.findOne({ flashcard_id: flashcardId });

      if (!flashcard || !quiz) { // ถ้าไม่พบ flashcard หรือ quiz ให้ส่งคืนข้อผิดพลาด
        return res.status(404).json({ success: false, message: 'ไม่พบข้อมูล flashcard หรือ quiz' });
      }
      // คำนวณค่าสถิติใหม่
      const newStat = flashcard.stat + value;
      // อัปเดต Flashcard และ Quiz และเก็บ Promise ไว้ในอาร์เรย์ updates
      updates.push(Flashcard.findByIdAndUpdate(flashcardId, { stat: newStat }, { new: true }));
      updates.push(Quiz.findByIdAndUpdate(quiz._id, { stat: newStat }, { new: true }));
    }
    // รอให้ทุก Promise ในอาร์เรย์ updates เสร็จสิ้น
    const updatedFlashcardsAndQuizzes = await Promise.all(updates);
    // ส่งคำตอบกลับไปยัง client พร้อมกับข้อมูล Flashcard และ Quiz ที่ถูกอัปเดตแล้ว
    res.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ', updatedFlashcardsAndQuizzes });
  } catch (error) {
    // ส่งคำตอบกลับไปยัง client ในกรณีเกิดข้อผิดพลาด
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', error: error.message });
  }
});

module.exports = flashcardRouter;