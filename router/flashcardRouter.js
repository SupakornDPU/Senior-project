const express = require('express');
const flashcardRouter = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs-extra');
const excelToJson = require('convert-excel-to-json');
const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');

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

module.exports = flashcardRouter;